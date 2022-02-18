import React from 'react'
import image from '../../../images/github.png'
import { Container, Box, Text, Image, Divider } from '@chakra-ui/react'

const Footer = () => {

  return (
    <>
      <Container className='footer' as={'footer'} bg={'#ffe4a0'} fontFamily={'Oswald'} padding={'2.5rem'} minW={'100%'} display={'flex'} justifyContent={'center'}>
        <Box w={'100%'}>
          <Text textAlign={'center'}>
            <p>Made by:</p>
          </Text>
          <Box lineHeight={'2rem'} gap={4} display={'flex'} justifyContent={'center'} w={'100%'}>
            <Box>
              <a href='https://github.com/greenplastic90'>Bashar</a>            
            </Box>
            <Box>
              <a href='https://github.com/florent-haxhiu'>Florent</a>
            </Box>
            <Box>
              <a href='https://github.com/mmay95'>Mehtaab</a>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default Footer