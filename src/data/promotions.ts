import { Promotion } from "@/types/dashboard";

export const promotions: Promotion[] = [
  {
    id: 1,
    bank: "Ciudad",
    bank_id: "ciudad",
    title: "30% de descuento en restaurantes",
    description: "Obtén un 30% de descuento en restaurantes seleccionados pagando con tu tarjeta Ciudad.",
    validUntil: "31/12/2023",
    category: "Gastronomía",
    isNew: true,
    cardType: "Visa",
    expiration_date: "31/12/2023",
    link_promotion: "https://www.bancociudad.com.ar/beneficios/promo?pagina=1",
    isLimitedTime: true,
    isExclusive: false
  },
  {
    id: 2,
    bank: "Ciudad",
    bank_id: "ciudad",
    title: "20% de descuento en cines",
    description: "Disfruta de un 20% de descuento en entradas de cine pagando con tu tarjeta Ciudad.",
    validUntil: "31/12/2023",
    category: "Entretenimiento",
    isNew: false,
    cardType: "Mastercard",
    expiration_date: "31/12/2023",
    link_promotion: "https://www.bancociudad.com.ar/beneficios/promo?pagina=1",
    isLimitedTime: true,
    isExclusive: false
  },
  {
    id: 3,
    bank: "BBVA",
    bank_id: "bbva",
    title: "40% de descuento en supermercados",
    description: "Aprovecha un 40% de descuento en supermercados seleccionados pagando con tu tarjeta BBVA.",
    validUntil: "31/12/2023",
    category: "Supermercados",
    isNew: true,
    cardType: "Visa",
    expiration_date: "31/12/2023",
    link_promotion: "https://go.bbva.com.ar/fgo/web_beneficios/beneficios",
    isLimitedTime: false,
    isExclusive: true
  },
  {
    id: 4,
    bank: "Galicia",
    bank_id: "galicia",
    title: "25% de descuento en farmacias",
    description: "Obtén un 25% de descuento en farmacias pagando con tu tarjeta Galicia.",
    validUntil: "31/12/2023",
    category: "Salud",
    isNew: false,
    cardType: "Mastercard",
    expiration_date: "31/12/2023",
    link_promotion: "https://www.galicia.ar/personas/buscador-de-promociones",
    isLimitedTime: true,
    isExclusive: false
  },
  {
    id: 5,
    bank: "Nación",
    bank_id: "nacion",
    title: "35% de descuento en indumentaria",
    description: "Disfruta de un 35% de descuento en tiendas de ropa seleccionadas pagando con tu tarjeta Nación.",
    validUntil: "31/12/2023",
    category: "Indumentaria",
    isNew: true,
    cardType: "Visa",
    expiration_date: "31/12/2023",
    link_promotion: "https://semananacion.com.ar/buscador",
    isLimitedTime: false,
    isExclusive: true
  },
  {
    id: 6,
    bank: "Ciudad",
    bank_id: "ciudad",
    title: "15% de descuento en hoteles",
    description: "Obtén un 15% de descuento en hoteles seleccionados pagando con tu tarjeta Ciudad.",
    validUntil: "31/12/2023",
    category: "Viajes",
    isNew: false,
    cardType: "American Express",
    expiration_date: "31/12/2023",
    link_promotion: "https://www.bancociudad.com.ar/beneficios/promo?pagina=1",
    isLimitedTime: true,
    isExclusive: false
  },
  {
    id: 7,
    bank: "BBVA",
    bank_id: "bbva",
    title: "50% de descuento en combustible",
    description: "Aprovecha un 50% de descuento en combustible los días jueves pagando con tu tarjeta BBVA.",
    validUntil: "31/12/2023",
    category: "Combustible",
    isNew: true,
    cardType: "Visa",
    expiration_date: "31/12/2023",
    link_promotion: "https://go.bbva.com.ar/fgo/web_beneficios/beneficios",
    isLimitedTime: true,
    isExclusive: true
  },
  {
    id: 8,
    bank: "Galicia",
    bank_id: "galicia",
    title: "30% de descuento en electrónica",
    description: "Disfruta de un 30% de descuento en productos electrónicos pagando con tu tarjeta Galicia.",
    validUntil: "31/12/2023",
    category: "Tecnología",
    isNew: false,
    cardType: "Mastercard",
    expiration_date: "31/12/2023",
    link_promotion: "https://www.galicia.ar/personas/buscador-de-promociones",
    isLimitedTime: false,
    isExclusive: false
  },
  {
    id: 9,
    bank: "Nación",
    bank_id: "nacion",
    title: "20% de descuento en librerías",
    description: "Obtén un 20% de descuento en librerías seleccionadas pagando con tu tarjeta Nación.",
    validUntil: "31/12/2023",
    category: "Educación",
    isNew: true,
    cardType: "Visa",
    expiration_date: "31/12/2023",
    link_promotion: "https://semananacion.com.ar/buscador",
    isLimitedTime: true,
    isExclusive: false
  },
  {
    id: 10,
    bank: "Ciudad",
    bank_id: "ciudad",
    title: "40% de descuento en perfumerías",
    description: "Aprovecha un 40% de descuento en perfumerías seleccionadas pagando con tu tarjeta Ciudad.",
    validUntil: "31/12/2023",
    category: "Belleza",
    isNew: false,
    cardType: "American Express",
    expiration_date: "31/12/2023",
    link_promotion: "https://www.bancociudad.com.ar/beneficios/promo?pagina=1",
    isLimitedTime: false,
    isExclusive: true
  }
];
