// Ejemplos de categorías para tienda de tatuajes
export const categoriasTatuajes = [
  {
    name: 'Agujas',
    descripcion: 'Agujas para tatuar de diferentes tipos y calibres',
    icono: 'agujas.png',
    activa: true,
    orden: 1,
    subcategorias: [
      { name: 'RL (Round Liner)', descripcion: 'Agujas para líneas redondas', calibres: ['1RL', '3RL', '5RL', '7RL', '9RL', '11RL', '13RL', '15RL'] },
      { name: 'RS (Round Shader)', descripcion: 'Agujas para sombreado redondo', calibres: ['3RS', '5RS', '7RS', '9RS', '11RS', '13RS', '15RS'] },
      { name: 'M1 (Magnum)', descripcion: 'Agujas magnum para relleno', calibres: ['5M1', '7M1', '9M1', '11M1', '13M1', '15M1'] },
      { name: 'M2 (Double Magnum)', descripcion: 'Agujas doble magnum', calibres: ['7M2', '9M2', '11M2', '13M2', '15M2'] },
      { name: 'RM (Round Magnum)', descripcion: 'Agujas magnum redondas', calibres: ['7RM', '9RM', '11RM', '13RM', '15RM'] },
      { name: 'F (Flat)', descripcion: 'Agujas planas', calibres: ['5F', '7F', '9F', '11F', '13F', '15F'] }
    ]
  },
  {
    name: 'Tintas',
    descripcion: 'Tintas para tatuar de diferentes tonos y marcas',
    icono: 'tintas.png',
    activa: true,
    orden: 2,
    tonos: [
      'Negro', 'Blanco', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja', 'Violeta', 'Rosa', 'Marrón', 'Gris', 'Turquesa', 'Magenta', 'Aqua', 'Lila', 'Skin', 'Ocre', 'Verde Oliva', 'Azul Marino', 'Mostaza', 'Coral', 'Borgoña', 'Cobre', 'Dorado', 'Plateado'
    ],
    marcas: ['Dynamic', 'Intenze', 'Eternal', 'World Famous', 'Kuro Sumi', 'Radiant', 'Solid Ink', 'Panthera']
  },
  {
    name: 'Máquinas',
    descripcion: 'Máquinas rotativas y de bobina para tatuar',
    icono: 'maquinas.png',
    activa: true,
    orden: 3
  },
  {
    name: 'Parches',
    descripcion: 'Parches y apósitos para cuidado posterior',
    icono: 'parches.png',
    activa: true,
    orden: 4
  },
  {
    name: 'Precios',
    descripcion: 'Clasificación de productos por rango de precio',
    icono: 'precios.png',
    activa: true,
    orden: 99,
    rangos: [
      { nombre: 'Económico', min: 0, max: 500 },
      { nombre: 'Medio', min: 501, max: 2000 },
      { nombre: 'Premium', min: 2001, max: 10000 }
    ]
  }
];
