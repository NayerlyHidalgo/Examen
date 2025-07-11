# Tattoo Shop Backend

Sistema de e-commerce para tienda de implementos de tatuaje desarrollado con NestJS.

## Descripción

Este proyecto es un sistema completo de e-commerce para una tienda de implementos de tatuaje que incluye:

- 🛍️ Catálogo de productos público
- 🛒 Carrito de compras
- 💳 Procesamiento de pagos
- 📦 Gestión de órdenes
- 👥 Sistema de usuarios
- 🔐 Autenticación y autorización
- 📊 Panel de administración

## Características Principales

### Frontend Público
- Catálogo de productos con filtros
- Carrito de compras con cálculo de IVA (19%)
- Checkout para clientes invitados
- Confirmación de órdenes

### Backend API
- API RESTful con NestJS
- Base de datos con TypeORM
- Autenticación JWT
- Validación de datos
- Gestión de archivos

### Panel de Administración
- Gestión de productos
- Gestión de categorías
- Gestión de órdenes
- Gestión de usuarios

## Tecnologías Utilizadas

- **Backend**: NestJS, TypeScript
- **Base de datos**: PostgreSQL/MySQL con TypeORM
- **Autenticación**: JWT, Passport
- **Frontend**: Handlebars, Bootstrap
- **Validación**: class-validator
- **Documentación**: Swagger (opcional)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/NayerlyHidalgo/Examen.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones
npm run migration:run

# Iniciar en modo desarrollo
npm run start:dev
```

## Configuración

Crear un archivo `.env` con las siguientes variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=tattoo_shop
JWT_SECRET=tu_jwt_secret
```

## Uso

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

## Endpoints Principales

### Público
- `GET /tienda` - Catálogo de productos
- `GET /tienda/producto/:id` - Detalle de producto
- `GET /tienda/carrito` - Carrito de compras
- `POST /tienda/checkout` - Procesar compra
- `GET /tienda/orden/:orderNumber` - Confirmación de orden

### API
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /products` - Listar productos
- `POST /products` - Crear producto
- `GET /orden` - Listar órdenes
- `POST /orden` - Crear orden

## Características del Sistema

### Cálculo de Precios
- Subtotal de productos
- IVA del 19%
- Envío gratis para compras superiores a $100
- Formato de precios con 2 decimales

### Gestión de Órdenes
- Órdenes para usuarios registrados
- Órdenes para clientes invitados
- Estados de orden (Pendiente, Procesando, Enviado, Entregado)
- Métodos de pago (Tarjeta de crédito, Tarjeta de débito)

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Contacto

Para preguntas o soporte, contacta a través de GitHub Issues.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
>>>>>>> c91172d (first commit)
=======
# Examen
examen final parcial 4
>>>>>>> 8e5a34bf08cd57dcdf9fb76e9fcf208559c61a52
