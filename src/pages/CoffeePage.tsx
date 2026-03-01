import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  HStack,
  VStack,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  CheckboxGroup,
  Checkbox,
  Stack,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Button,
  Badge,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  Collapse,
  useDisclosure,
  Icon,
} from '@chakra-ui/react';
import { PageLayout } from '../components/shared/layout/PageLayout';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/product.service';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { Product, RoastLevel } from '../types/product.types';
import { ROAST_LABELS } from '../constants/product.constants';

const COFFEE_METADATA: Record<string, { roastLevel: RoastLevel; tastingNotes: string[] }> = {
  'Ethiopia Yirgacheffe':     { roastLevel: 'light',       tastingNotes: ['jasmin', 'agrumes', 'pêche blanche'] },
  'Colombia Huila':           { roastLevel: 'medium',      tastingNotes: ['caramel', 'noisette', 'fruits rouges'] },
  'Kenya AA':                 { roastLevel: 'light',       tastingNotes: ['cassis', 'tomate', 'pamplemousse'] },
  'Guatemala Antigua':        { roastLevel: 'dark',        tastingNotes: ['chocolat noir', 'cannelle', 'fumée'] },
  'Brazil Santos Moulu':      { roastLevel: 'medium',      tastingNotes: ['noix', 'chocolat au lait', 'vanille'] },
  'Espresso Intenso Moulu':   { roastLevel: 'dark',        tastingNotes: ['cacao amer', 'réglisse', 'épices'] },
  'Décaf Colombia':           { roastLevel: 'medium',      tastingNotes: ['caramel', 'noisette', 'fruits rouges'] },
  'Dosettes Ethiopia x16':    { roastLevel: 'light',       tastingNotes: ['jasmin', 'agrumes', 'pêche blanche'] },
  'Dosettes Espresso Intenso x16': { roastLevel: 'dark',  tastingNotes: ['cacao amer', 'réglisse', 'épices'] },
};

const AROMA_PROFILES: Record<string, string[]> = {
  'Agrumes': ['citron', 'orange', 'bergamote'],
  'Fruits rouges': ['fraise', 'framboise', 'cerise'],
  'Fruits tropicaux': ['ananas', 'mangue', 'pêche'],
  'Chocolat / Cacao': ['chocolat', 'cacao'],
  'Caramel / Toffee': ['caramel', 'toffee'],
  'Noisette / Noix': ['noisette', 'noix'],
  'Floral': ['jasmin', 'fleur d\'oranger'],
  'Épices': ['cannelle', 'clou de girofle'],
  'Boisé / Herbacé': ['bois', 'herbacé'],
  'Vin / Acidulé': ['vin', 'acidulé'],
};

const SORT_OPTIONS = [
  { value: 'default', label: 'Par défaut' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'name-asc', label: 'Nom A → Z' },
  { value: 'stock-desc', label: 'Disponibilité' },
];

export const CoffeePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isOpen: filtersOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  // ── Data ──────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Filters ───────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [selectedRoasts, setSelectedRoasts] = useState<string[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30]);
  const [sortBy, setSortBy] = useState('default');

  // Load all products once
  useEffect(() => {
    setLoading(true);
    productService.search()
      .then((data) => {
        // enrich with metadata lookup
        const enriched = data.map((p) => {
          const meta = COFFEE_METADATA[p.name];
          return {
            ...p,
            roastLevel: meta?.roastLevel || p.roastLevel,
            tastingNotes: meta?.tastingNotes || p.tastingNotes || [],
          } as Product;
        });
        setProducts(enriched);
        // init price range based on actual data (max 45 €/kg)
        if (enriched.length) {
          const prices = enriched.map((p) => p.price);
          const min = Math.floor(Math.min(...prices));
          setPriceRange([min, 45]);
        }
      })
      .catch(() => setError('Impossible de charger les produits. Vérifiez que le serveur est démarré.'))
      .finally(() => setLoading(false));
  }, []);


  // profile names are fixed by requirement
  const profileNames = useMemo(() => Object.keys(AROMA_PROFILES), []);

  // Price bounds from actual data – max fixed at 45€
  const [minBound, maxBound] = useMemo(() => {
    if (!products.length) return [0, 45];
    const prices = products.map((p) => p.price);
    const min = Math.floor(Math.min(...prices));
    return [min, 45];
  }, [products]);

  // ── Filtered + sorted list ────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...products];

    // text search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tastingNotes?.some((n) => n.toLowerCase().includes(q))
      );
    }

    // roast level
    if (selectedRoasts.length > 0) {
      list = list.filter((p) => p.roastLevel && selectedRoasts.includes(p.roastLevel));
    }

    // aromatic profiles
    if (selectedProfiles.length > 0) {
      list = list.filter((p) => {
        const notes = p.tastingNotes || [];
        return selectedProfiles.some((profile) =>
          AROMA_PROFILES[profile].some((note) => notes.includes(note))
        );
      });
    }

    // price range
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // sort
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'stock-desc':
        list.sort((a, b) => b.stock - a.stock);
        break;
    }

    return list;
  }, [products, search, selectedRoasts, selectedProfiles, priceRange, sortBy]);

  const activeFiltersCount =
    selectedRoasts.length +
    selectedProfiles.length +
    (priceRange[0] > minBound || priceRange[1] < maxBound ? 1 : 0);

  const resetFilters = () => {
    setSearch('');
    setSelectedRoasts([]);
    setSelectedProfiles([]);
    setPriceRange([minBound, maxBound]);
    setSortBy('default');
  };

  const handleAddToCart = (productId: number) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    addToCart(productId).catch((err) => console.error('Erreur ajout panier:', err));
  };

  return (
    <PageLayout bg="background.cream">
      {/* Page header */}
      <Box bg="primary.900" color="white" py={{ base: 12, md: 16 }} px={{ base: 6, lg: 12 }}>
        <Container maxW="container.xl">
          <Badge
            bg="secondary.500"
            color="primary.900"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="widest"
            textTransform="uppercase"
            mb={4}
            display="block"
            w="fit-content"
          >
            Notre sélection
          </Badge>
          <Heading
            as="h1"
            size="2xl"
            fontFamily="heading"
            color="white"
            textShadow="0 0 6px rgba(0,0,0,0.7)"
          >
            Nos Cafés
          </Heading>
          <Text
            mt={3}
            fontSize="lg"
            color="white"
            opacity={0.9}
            textShadow="0 0 4px rgba(0,0,0,0.6)"
            maxW="540px"
          >
            Huit origines soigneusement sélectionnées, torréfiées à la commande pour
            révéler le meilleur de chaque terroir.
          </Text>
        </Container>
      </Box>

      <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
        {/* Top bar : search + sort + filter toggle */}
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', sm: 'center' }}
          gap={3}
          mb={6}
        >
          <InputGroup maxW={{ base: '100%', sm: '340px' }}>
            <InputLeftElement pointerEvents="none">
              <Icon viewBox="0 0 24 24" color="gray.400" boxSize={4}>
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </Icon>
            </InputLeftElement>
            <Input
              placeholder="Rechercher un café…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              bg="white"
              borderColor="gray.200"
              _focus={{ borderColor: 'secondary.500', boxShadow: 'none' }}
            />
          </InputGroup>

          <HStack spacing={2} flexWrap="wrap">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="md"
              bg="white"
              borderColor="gray.200"
              flex={{ base: '1', sm: 'none' }}
              maxW={{ base: '100%', sm: '200px' }}
              _focus={{ borderColor: 'secondary.500', boxShadow: 'none' }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>

            <Button
              variant="outline"
              borderColor="gray.300"
              size="md"
              onClick={onToggle}
              flexShrink={0}
              _hover={{ bg: 'secondary.50', borderColor: 'secondary.400' }}
            >
              Filtres
              {activeFiltersCount > 0 && (
                <Badge ml={2} bg="secondary.500" color="primary.900" borderRadius="full" fontSize="xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="md" color="gray.500" onClick={resetFilters} flexShrink={0}>
                Réinitialiser
              </Button>
            )}
          </HStack>
        </Flex>

        {/* Filter panel */}
        <Collapse in={filtersOpen} animateOpacity>
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            p={6}
            mb={8}
          >
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
              {/* Roast level */}
              <Box>
                <Text fontWeight="semibold" color="primary.900" mb={3} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                  Torréfaction
                </Text>
                <CheckboxGroup
                  value={selectedRoasts}
                  onChange={(vals) => setSelectedRoasts(vals as string[])}
                >
                  <Stack spacing={2}>
                    {Object.entries(ROAST_LABELS).map(([val, label]) => (
                      <Checkbox
                        key={val}
                        value={val}
                        colorScheme="yellow"
                        size="md"
                      >
                        <Text fontSize="sm">{label}</Text>
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>

              {/* Profil aromatique */}
              <Box>
                <Text fontWeight="semibold" color="primary.900" mb={3} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                  Profil aromatique
                </Text>
                <CheckboxGroup
                  value={selectedProfiles}
                  onChange={(vals) => setSelectedProfiles(vals as string[])}
                >
                  <Stack spacing={2} maxH="160px" overflowY="auto">
                    {profileNames.map((profile) => (
                      <Checkbox
                        key={profile}
                        value={profile}
                        colorScheme="yellow"
                        size="md"
                      >
                        <Text fontSize="sm">{profile}</Text>
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>

              {/* Prix */}
              <Box gridColumn={{ md: 'span 2' }}>
                <Text fontWeight="semibold" color="primary.900" mb={3} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                  Fourchette de prix (€/kg)
                </Text>
                <HStack justify="space-between" mb={3}>
                  <Badge bg="gray.100" color="gray.700" px={3} py={1} borderRadius="md">
                    {priceRange[0].toFixed(2)} €/kg
                  </Badge>
                  <Badge bg="gray.100" color="gray.700" px={3} py={1} borderRadius="md">
                    {priceRange[1].toFixed(2)} €/kg
                  </Badge>
                </HStack>
                <RangeSlider
                  min={minBound}
                  max={45}
                  step={0.5}
                  value={priceRange}
                  onChange={(vals) => setPriceRange([vals[0], vals[1]])}
                  colorScheme="yellow"
                >
                  <RangeSliderTrack bg="gray.200">
                    <RangeSliderFilledTrack bg="secondary.500" />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} boxSize={5} boxShadow="md" />
                  <RangeSliderThumb index={1} boxSize={5} boxShadow="md" />
                </RangeSlider>
              </Box>
            </SimpleGrid>
          </Box>
        </Collapse>

        {/* Results */}
        {loading && (
          <VStack py={20}>
            <Spinner size="xl" color="secondary.500" />
            <Text color="gray.500">Chargement des cafés…</Text>
          </VStack>
        )}

        {!loading && error && (
          <Alert status="error" borderRadius="lg">
            <AlertIcon />{error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            <HStack justify="space-between" mb={5}>
              <Text color="gray.500" fontSize="sm">
                {filtered.length} café{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
              </Text>
              {activeFiltersCount > 0 && (
                <HStack spacing={2} flexWrap="wrap">
                  {selectedRoasts.map((r) => (
                    <Badge key={r} colorScheme="orange" variant="subtle" px={2}>
                      {ROAST_LABELS[r as RoastLevel]}
                    </Badge>
                  ))}
                  {selectedProfiles.map((p) => (
                    <Badge key={p} colorScheme="yellow" variant="subtle" px={2}>{p}</Badge>
                  ))}
                </HStack>
              )}
            </HStack>

            {filtered.length === 0 ? (
              <VStack py={16} spacing={4}>
                <Text fontSize="2xl">☕</Text>
                <Text color="gray.500" textAlign="center">
                  Aucun café ne correspond à vos critères.
                </Text>
                <Button variant="outline" onClick={resetFilters}>
                  Réinitialiser les filtres
                </Button>
              </VStack>
            ) : (
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing={6}>
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onCardClick={(id) => navigate(`/product/${id}`)}
                  />
                ))}
              </SimpleGrid>
            )}

            <Divider mt={16} mb={6} />
            <Text textAlign="center" fontSize="sm" color="gray.400">
              Tous nos cafés sont torréfiés à la commande et expédiés sous 48h.
            </Text>
          </>
        )}
      </Container>
    </PageLayout>
  );
};

export default CoffeePage;
