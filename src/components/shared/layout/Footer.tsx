import { Box, Container, Flex, Heading, Text, VStack } from '@chakra-ui/react';

export const Footer = () => {
  return (
    <Box bg="primary.900" color="gray.200" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={5}>
          <Heading size="lg" fontFamily="heading" color="white">
            Meridian Coffee
          </Heading>
          <Flex
            gap={{ base: 4, sm: 8 }}
            fontSize="small"
            flexWrap="wrap"
            justify="center"
          >
            <Text color="white" cursor="pointer" _hover={{ color: 'secondary.500' }}>
              À propos
            </Text>
            <Text color="white" cursor="pointer" _hover={{ color: 'secondary.500' }}>
              Contact
            </Text>
            <Text color="white" cursor="pointer" _hover={{ color: 'secondary.500' }}>
              CGV
            </Text>
          </Flex>
          <Text fontSize="small" color="gray.300" textAlign="center">
            © 2026 Forest Roast. Tous droits réservés.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};
