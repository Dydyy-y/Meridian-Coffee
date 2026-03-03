import { 
  Card, 
  CardBody, 
  Image, 
  Heading, 
  Text, 
  Badge, 
  Button, 
  VStack, 
  HStack,
  Box
} from '@chakra-ui/react';
import type { Product } from '../types/product.types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void; //callback pour ajouter au panier
  onCardClick?: (productId: number) => void; //naviguer vers la page détail
}

export const ProductCard = ({ product, onAddToCart, onCardClick }: ProductCardProps) => {
  //stoppe la propagation pour ne pas déclencher onCardClick
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // empêche le clic de remonter vers la Card
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  // Clic sur la card entière = naviguer vers la page détail
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(product.id);
    }
  };

  return (
    <Card 
      maxW="sm" 
      cursor="pointer"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl'
      }}
      onClick={handleCardClick}
      role="button"
      aria-label={`Voir le détail de ${product.name}`}
    >
      <CardBody p={0}>
        {/* Image du produit */}
        <Box position="relative">
          <Image 
            src={product.images?.[0]?.link || 'https://placehold.co/400x300?text=Café'}
            alt={product.images?.[0]?.alt || product.name}
            borderTopRadius="12px"
            objectFit="cover"
            h="250px"
            w="100%"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Café';
            }}
          />
          
          {/* Badge stock faible */}
          {product.stock < 20 && (
            <Badge 
              position="absolute" 
              top={4} 
              right={4} 
              colorScheme="red"
              fontSize="xs"
            >
              Stock limité
            </Badge>
          )}
        </Box>
        
        {/* Contenu de la card */}
        <VStack align="start" p={5} spacing={3}>
          
          {/* Badges : Origine + Certifications */}
          <HStack spacing={2} flexWrap="wrap">
            {product.origin?.country && (
              <Badge 
                bg="secondary.500" 
                color="primary.900"
                fontSize="xs"
                textTransform="uppercase"
              >
                {product.origin.country}
              </Badge>
            )}
            
            {product.certifications?.includes('Bio') && (
              <Badge colorScheme="green" fontSize="xs">
                Bio
              </Badge>
            )}
            
            {product.certifications?.includes('Fair Trade') && (
              <Badge colorScheme="orange" fontSize="xs">
                Fair Trade
              </Badge>
            )}
          </HStack>
          
          {/* Nom du café */}
          <Heading 
            size="lg" 
            fontFamily="heading"
            color="primary.900"
            noOfLines={1}
          >
            {product.name}
          </Heading>
          
          {/* Notes de dégustation */}
          {product.tastingNotes && product.tastingNotes.length > 0 && (
            <Text 
              fontSize="body" 
              color="gray.600"
              noOfLines={2}
            >
              {product.tastingNotes.join(' • ')}
            </Text>
          )}
          
          {/* Informations supplémentaires */}
          <HStack spacing={4} fontSize="small" color="gray.500">
            {product.roastLevel && (
              <Text>
                Torréfaction : <strong>{product.roastLevel}</strong>
              </Text>
            )}
            {product.intensity && (
              <Text>
                Intensité : <strong>{product.intensity}/10</strong>
              </Text>
            )}
          </HStack>
          
          {/* Prix + Bouton Ajouter */}
          <HStack justify="space-between" w="100%" pt={2}>
            <Text 
              fontSize="large" 
              fontWeight="600"
              color="primary.900"
            >
              {product.price.toFixed(2)}€
            </Text>
            
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleAddToCart}
              isDisabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Épuisé' : 'Ajouter'}
            </Button>
          </HStack>
          
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ProductCard;
