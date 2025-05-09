import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const UnauthorizedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5e9dc 0%, #e6d2c0 100%);
  text-align: center;
  overflow: hidden;
  position: relative;
`;

const CoffeeStain = styled(motion.div)`
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(101, 67, 33, 0.8) 0%, rgba(101, 67, 33, 0.1) 70%);
  z-index: 1;
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const ContentBox = styled(motion.div)`
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(101, 67, 33, 0.2);
  z-index: 2;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(90deg, #8D6E63, #A1887F, #D7CCC8);
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    width: 85%;
  }
`;

const Title = styled(motion.h1)`
  color: #5D4037;
  font-size: 2.5rem;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Message = styled(motion.p)`
  color: #795548;
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Highlight = styled.span`
  color: #5D4037;
  font-weight: bold;
`;

const CoffeeIcon = styled(motion.div)`
  margin-bottom: 20px;
  font-size: 4rem;
  color: #8D6E63;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const CoffeeNote = styled(motion.div)`
  background-color: #f8f3e9;
  border-left: 4px solid #8D6E63;
  padding: 15px;
  margin: 20px 0;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: #6D4C41;
  text-align: left;
  
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.9rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Button = styled(motion.button)`
  background-color: #795548;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #5D4037;
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 10px 20px;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: #795548;
  border: 2px solid #795548;
  
  &:hover {
    background-color: rgba(121, 85, 72, 0.1);
  }
`;

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  // Generar posiciones aleatorias para las manchas de café
  const stains = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: 0.5 + Math.random() * 1.5,
    opacity: 0.1 + Math.random() * 0.3,
  }));

  // Animación para el icono de café
  const steamVariants = {
    animate: {
      y: [0, -10, 0],
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Redirigir al usuario a la página principal
  const handleGoBack = () => {
    navigate('/');
  };

  // Redirigir al usuario a la página de contacto
  const handleContact = () => {
    navigate('/contact');
  };

  return (
    <UnauthorizedContainer>
      {stains.map((stain) => (
        <CoffeeStain
          key={stain.id}
          style={{
            left: `${stain.x}%`,
            top: `${stain.y}%`,
            opacity: stain.opacity,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: stain.scale }}
          transition={{ duration: 1 }}
        />
      ))}
      
      <ContentBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <CoffeeIcon>
          <motion.span role="img" aria-label="coffee">☕</motion.span>
          <motion.span
            role="img"
            aria-label="steam"
            variants={steamVariants}
            animate="animate"
            style={{ display: 'inline-block', marginLeft: '-5px' }}
          >
            ~
          </motion.span>
        </CoffeeIcon>
        
        <Title
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ¡Oops! Área reservada
        </Title>
        
        <Message
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Parece que has intentado acceder a un área <Highlight>exclusiva para baristas</Highlight>. 
          Como nuestro café, algunas cosas necesitan permisos especiales para disfrutarlas.
        </Message>
        
        <CoffeeNote
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          "El buen café, como los buenos permisos, no se consiguen por casualidad. 
          Ambos requieren el proceso adecuado y las credenciales correctas."
        </CoffeeNote>
        
        <Message
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Si crees que deberías tener acceso, contacta con nuestro equipo mientras disfrutas de un delicioso espresso.
        </Message>
        
        <ButtonContainer>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
          >
            Volver al menú principal
          </Button>
          <SecondaryButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContact}
          >
            Contactar soporte
          </SecondaryButton>
        </ButtonContainer>
      </ContentBox>
    </UnauthorizedContainer>
  );
};

export default UnauthorizedPage;