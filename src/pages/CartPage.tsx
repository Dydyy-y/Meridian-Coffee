import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Image,
  Divider,
  Spinner,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { useCart } from '../context/CartContext';
import { PageLayout } from '../components/shared/layout/PageLayout';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cart, isLoading, removeFromCart, loadingProductId } = useCart();

  // Loading
  if (isLoading && !cart) {
    return (
      <PageLayout>
        <Flex minH="60vh" justify="center" align="center" direction="column" gap={4}>
          <Spinner size="xl" color="secondary.400" thickness="3px" />
          <Text color="gray.500">Chargement du panier...</Text>
        </Flex>
      </PageLayout>
    );
  }

  // Panier vide
  if (!cart || cart.Products.length === 0) {
    return (
      <PageLayout>

        {/* Panier vide */}
        <Container maxW="container.md" py={20} textAlign="center">
          <Text fontSize="64px" mb={4}>🛒</Text>
          <Heading fontFamily="heading" color="primary.900" mb={4}>
            Votre panier est vide
          </Heading>
          <Text color="gray.500" mb={8}>
            Vous n'avez pas encore ajouté de produits à votre panier.
          </Text>
          <Button variant="primary" onClick={() => navigate('/')}>
            Découvrir nos cafés
          </Button>
        </Container>
      </PageLayout>
    );
  }

  // Rendu principal
  return (
    <PageLayout>

      <Container maxW="container.lg" py={{ base: 8, md: 12 }}>

        <Heading fontFamily="heading" color="primary.900" mb={8}>
          Mon panier{' '}
          <Badge
            bg="secondary.500"
            color="primary.900"
            fontSize="sm"
            px={3}
            py={1}
            borderRadius="full"
          >
            {cart.Products.length} article{cart.Products.length > 1 ? 's' : ''}
          </Badge>
        </Heading>

        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={8}
          align="flex-start"
        >

          {/*Liste des produits*/}
          <VStack flex={1} spacing={4} align="stretch">
            {cart.Products.map((product) => (
              <Box
                key={product.id}
                bg="white"
                borderRadius="12px"
                p={4}
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
              >
                <HStack spacing={4} align="flex-start">

                  {/* Image produit */}
                  <Image
                    src={
                      product.images?.[0]?.link ||
                      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200'
                    }
                    alt={product.images?.[0]?.alt || product.name}
                    boxSize="80px"
                    objectFit="cover"
                    borderRadius="8px"
                    flexShrink={0}
                  />

                  {/* Infos produit */}
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontWeight="600" color="primary.900" fontSize="md">
                      {product.name}
                    </Text>
                    <Text fontWeight="700" color="primary.900" fontSize="lg">
                      {product.price.toFixed(2)} €
                    </Text>
                  </VStack>

                  {/* Bouton supprimer */}
                  <IconButton
                    aria-label={`Retirer ${product.name} du panier`}
                    icon={<span>✕</span>}
                    variant="ghost"
                    size="sm"
                    color="gray.400"
                    isLoading={loadingProductId === product.id}
                    onClick={() => removeFromCart(product.id)}
                    _hover={{ color: 'red.500', bg: 'red.50' }}
                  />
                </HStack>
              </Box>
            ))}
          </VStack>

          {/* Récapitulatif commande */}
          <Box
            bg="white"
            borderRadius="16px"
            p={6}
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
            w={{ base: '100%', lg: '320px' }}
            flexShrink={0}
            position={{ lg: 'sticky' }}
            top={{ lg: '20px' }}
          >
            <Heading size="md" fontFamily="heading" color="primary.900" mb={6}>
              Récapitulatif
            </Heading>

            <VStack spacing={3} mb={4}>
              <HStack justify="space-between" w="100%">
                <Text color="gray.600">
                  Sous-total ({cart.Products.length} article{cart.Products.length > 1 ? 's' : ''})
                </Text>
                <Text fontWeight="500">{cart.total.toFixed(2)} €</Text>
              </HStack>
              <HStack justify="space-between" w="100%">
                <Text color="gray.600">Livraison</Text>
                <Text fontWeight="500" color="green.600">
                  Gratuite
                </Text>
              </HStack>
            </VStack>

            <Divider mb={4} />

            {/* Total */}
            <HStack justify="space-between" w="100%" mb={6}>
              <Text fontWeight="700" fontSize="lg" color="primary.900">
                Total
              </Text>
              <Text fontWeight="700" fontSize="xl" color="primary.900">
                {cart.total.toFixed(2)} €
              </Text>
            </HStack>

            {/* Bouton passer commande */}
            <Button
              variant="primary"
              size="lg"
              w="100%"
              isLoading={isLoading}
              onClick={() => navigate('/order-confirmation')}
            >
              Passer la commande
            </Button>

            <Text fontSize="xs" color="gray.400" mt={3} textAlign="center">
              Paiement sécurisé · Livraison gratuite
            </Text>
          </Box>

        </Flex>
      </Container>
    </PageLayout>
  );
};

export default CartPage;
