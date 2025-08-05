// Dados de exemplo para o e-commerce
// Substitua as URLs das imagens por imagens reais dos seus produtos

export const roupasData = [
  {
    id: 1,
    name: 'Vestido Floral Midi',
    description: 'Vestido midi com estampa floral delicada, perfeito para o verão',
    price: '89,90',
    originalPrice: '119,90',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop&crop=center',
    sizes: ['P', 'M', 'G', 'GG'],
    isNew: true
  },
  {
    id: 2,
    name: 'Blusa Básica Cotton',
    description: 'Blusa básica em algodão, confortável para o dia a dia',
    price: '49,90',
    image: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=300&h=300&fit=crop&crop=center',
    sizes: ['P', 'M', 'G'],
    isNew: false
  },
  {
    id: 3,
    name: 'Conjunto Cropped + Short',
    description: 'Conjunto moderno cropped com short de cintura alta',
    price: '79,90',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop&crop=center',
    sizes: ['P', 'M', 'G', 'GG'],
    isNew: true
  },
  {
    id: 4,
    name: 'Saia Midi Plissada',
    description: 'Saia midi com pregas, elegante e feminina',
    price: '69,90',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d24?w=300&h=300&fit=crop&crop=center',
    sizes: ['P', 'M', 'G'],
    isNew: false
  }
]

export const bolsasData = [
  {
    id: 1,
    name: 'Bolsa Tote Grande',
    description: 'Bolsa tote espaçosa em couro sintético, ideal para o dia a dia',
    price: '159,90',
    originalPrice: '199,90',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center',
    sizes: ['Único'],
    isNew: true
  },
  {
    id: 2,
    name: 'Bolsa Tiracolo Pequena',
    description: 'Bolsa tiracolo compacta e elegante para ocasiões especiais',
    price: '89,90',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop&crop=center',
    sizes: ['Único'],
    isNew: false
  },
  {
    id: 3,
    name: 'Mochila Fashion',
    description: 'Mochila moderna em couro ecológico, prática e estilosa',
    price: '129,90',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center',
    sizes: ['Único'],
    isNew: true
  },
  {
    id: 4,
    name: 'Clutch Festa',
    description: 'Clutch elegante com brilho para eventos noturnos',
    price: '79,90',
    image: 'https://images.unsplash.com/photo-1624687943971-e86af76abf12?w=300&h=300&fit=crop&crop=center',
    sizes: ['Único'],
    isNew: false
  }
]

export const sapatosData = [
  {
    id: 1,
    name: 'Scarpin Clássico',
    description: 'Scarpin de salto médio, ideal para trabalho e eventos',
    price: '159,90',
    originalPrice: '199,90',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop&crop=center',
    sizes: ['34', '35', '36', '37', '38', '39'],
    isNew: true
  },
  {
    id: 2,
    name: 'Tênis Casual Branco',
    description: 'Tênis casual branco, conforto para o dia a dia',
    price: '119,90',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center',
    sizes: ['34', '35', '36', '37', '38', '39'],
    isNew: false
  },
  {
    id: 3,
    name: 'Sandália Rasteira',
    description: 'Sandália rasteira confortável para verão',
    price: '79,90',
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300&h=300&fit=crop&crop=center',
    sizes: ['34', '35', '36', '37', '38', '39'],
    isNew: true
  },
  {
    id: 4,
    name: 'Bota Ankle Boot',
    description: 'Ankle boot moderna para looks despojados',
    price: '189,90',
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop&crop=center',
    sizes: ['34', '35', '36', '37', '38', '39'],
    isNew: false
  }
]

export const featuredProducts = [
  ...roupasData.slice(0, 2),
  ...bolsasData.slice(0, 1),
  ...sapatosData.slice(0, 1)
]
