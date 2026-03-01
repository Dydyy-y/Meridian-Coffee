import {
  Box,
  Flex,
  Heading,
  HStack,
  Button,
  Badge,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Divider,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';

/** Icône hamburger (3 lignes) */
const HamburgerIcon = () => (
  <Box as="span" display="flex" flexDirection="column" gap="5px" w="20px">
    <Box as="span" h="2px" bg="primary.900" borderRadius="full" />
    <Box as="span" h="2px" bg="primary.900" borderRadius="full" />
    <Box as="span" h="2px" bg="primary.900" borderRadius="full" />
  </Box>
);

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const cartCount = cart?.Products?.length ?? 0;

  return (
    <>
      <Flex
        as="nav"
        bg="background.cream"
        py={4}
        px={{ base: 4, md: 6, lg: 12 }}
        align="center"
        position="sticky"
        top={0}
        zIndex={100}
        boxShadow="0 1px 0 rgba(0,0,0,0.06)"
      >
        {/* Logo */}
        <Heading
          size={{ base: 'md', md: 'lg' }}
          fontFamily="heading"
          color="primary.900"
          cursor="pointer"
          onClick={() => navigate('/')}
          flexShrink={0}
        >
          Meridian Coffee
        </Heading>

        {/* Navigation desktop */}
        <HStack spacing={1} align="center" ml={8} display={{ base: 'none', md: 'flex' }}>
          <Button
            variant="ghost"
            size="sm"
            color="primary.900"
            fontWeight="medium"
            onClick={() => navigate('/cafes')}
            _hover={{ bg: 'secondary.50' }}
          >
            Café
          </Button>
          <Button
            variant="ghost"
            size="sm"
            color="primary.900"
            fontWeight="medium"
            onClick={() => navigate('/abonnement')}
            _hover={{ bg: 'secondary.50' }}
          >
            Abonnement
          </Button>
        </HStack>

        <Box flex="1" />

        {/* Boutons desktop */}
        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                color="primary.900"
                onClick={() => navigate('/profile')}
              >
                Mon profil
              </Button>

              <Button
                variant="ghost"
                size="sm"
                color="primary.900"
                position="relative"
                onClick={() => navigate('/cart')}
              >
                Panier
                {cartCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    bg="secondary.500"
                    color="primary.900"
                    borderRadius="full"
                    fontSize="xs"
                    minW="18px"
                    h="18px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>

              <Button variant="outline" size="sm" colorScheme="red" onClick={handleLogout}>
                Se déconnecter
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Se connecter
            </Button>
          )}
        </HStack>

        {/* Icônes mobile : panier + hamburger */}
        <HStack spacing={2} display={{ base: 'flex', md: 'none' }}>
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              color="primary.900"
              position="relative"
              px={2}
              onClick={() => navigate('/cart')}
              aria-label="Panier"
            >
              🛒
              {cartCount > 0 && (
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  bg="secondary.500"
                  color="primary.900"
                  borderRadius="full"
                  fontSize="xs"
                  minW="16px"
                  h="16px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          )}
          <IconButton
            aria-label="Ouvrir le menu"
            icon={<HamburgerIcon />}
            variant="ghost"
            size="sm"
            onClick={onOpen}
          />
        </HStack>
      </Flex>

      {/* ── Drawer mobile ── */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg="background.cream">
          <DrawerCloseButton color="primary.900" top={4} right={4} />
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.200" pb={3}>
            <Heading size="md" fontFamily="heading" color="primary.900">
              Forest Roast
            </Heading>
          </DrawerHeader>

          <DrawerBody py={6}>
            <VStack spacing={2} align="stretch">

              {/* Navigation */}
              <Button
                variant="ghost"
                justifyContent="flex-start"
                size="md"
                color="primary.900"
                fontWeight="medium"
                onClick={() => handleNav('/cafes')}
                _hover={{ bg: 'secondary.50' }}
              >
                ☕ Nos Cafés
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                size="md"
                color="primary.900"
                fontWeight="medium"
                onClick={() => handleNav('/abonnement')}
                _hover={{ bg: 'secondary.50' }}
              >
                📦 Abonnement
              </Button>

              <Divider my={2} />

              {/* Auth */}
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    size="md"
                    color="primary.900"
                    onClick={() => handleNav('/profile')}
                    _hover={{ bg: 'secondary.50' }}
                  >
                    👤 Mon profil
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    size="md"
                    color="primary.900"
                    position="relative"
                    onClick={() => handleNav('/cart')}
                    _hover={{ bg: 'secondary.50' }}
                  >
                    🛒 Panier
                    {cartCount > 0 && (
                      <Badge ml={2} bg="secondary.500" color="primary.900" borderRadius="full" fontSize="xs" px={2}>
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                  <Divider my={2} />
                  <Button
                    variant="outline"
                    colorScheme="red"
                    size="md"
                    onClick={handleLogout}
                  >
                    Se déconnecter
                  </Button>
                </>
              ) : (
                <Button variant="primary" size="md" onClick={() => handleNav('/login')}>
                  Se connecter
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
