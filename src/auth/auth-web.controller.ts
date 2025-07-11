import { Controller, Get, Post, Render, Body, Session, Res, Req, UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';
import { Response, Request } from 'express';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

// Filtro personalizado para manejar errores de validación
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
class NoValidationFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // No hacer nada, dejar que el controlador maneje los errores
    throw exception;
  }
}

@Controller('auth')
export class AuthWebController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('login')
  @Render('auth/login')
  async loginPage(@Session() session: any, @Req() req: Request) {
    // Si ya está autenticado, redirigir según el rol
    if (session.user) {
      if (session.user.role === UserRole.ADMIN) {
        return { redirect: '/admin/dashboard' };
      } else {
        return { redirect: '/shop' };
      }
    }
    
    return {
      title: 'Iniciar Sesión - Tattoo Shop',
      error: null,
      redirect: req.query.redirect || '/shop'
    };
  }

  @Get('register')
  @Render('auth/register')
  async registerPage(@Session() session: any) {
    // Si ya está autenticado, redirigir
    if (session.user) {
      return { redirect: '/shop' };
    }
    
    return {
      title: 'Crear Cuenta - Tattoo Shop',
      error: null
    };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Session() session: any,
    @Res() res: Response
  ) {
    const { email, password } = body;

    try {
      // Verificar si es el admin especial
      if (email === 'melifer.j1995@gmail.com' && password === 'M3l5N128.12') {
        // Crear o encontrar usuario admin
        let adminUser = await this.usersService.findByEmail(email);
        
        if (!adminUser) {
          // Crear usuario admin si no existe
          adminUser = await this.usersService.create({
            username: 'admin',
            email: 'melifer.j1995@gmail.com',
            password: password,
            firstName: 'Administrador',
            lastName: 'Principal',
            role: UserRole.ADMIN,
            isActive: true,
            emailVerified: true
          });
        }

        if (adminUser) {
          session.user = {
            id: adminUser.id,
            email: adminUser.email,
            role: UserRole.ADMIN,
            firstName: adminUser.firstName,
            lastName: adminUser.lastName
          };

          session.adminAuthenticated = true;
          session.adminUser = session.user;

          return res.redirect('/admin/dashboard');
        }
      }

      // Autenticación normal de usuario
      const user = await this.usersService.findByEmail(email);
      
      if (!user) {
        return res.render('auth/login', {
          title: 'Iniciar Sesión - Tattoo Shop',
          error: 'Email o contraseña incorrectos'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.render('auth/login', {
          title: 'Iniciar Sesión - Tattoo Shop',
          error: 'Email o contraseña incorrectos'
        });
      }

      if (!user.isActive) {
        return res.render('auth/login', {
          title: 'Iniciar Sesión - Tattoo Shop',
          error: 'Tu cuenta está desactivada. Contacta al administrador.'
        });
      }

      // Crear sesión de usuario
      session.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      };

      // Guardar sesión explícitamente
      await new Promise((resolve, reject) => {
        session.save((err) => {
          if (err) {
            console.error('Error al guardar la sesión:', err);
            reject(err);
          } else {
            console.log('Sesión guardada exitosamente');
            resolve(true);
          }
        });
      });

      // Redirigir según rol
      if (user.role === UserRole.ADMIN) {
        session.adminAuthenticated = true;
        session.adminUser = session.user;
        console.log('Admin login successful, redirecting to /admin/dashboard');
        return res.redirect('/admin/dashboard');
      } else {
        console.log('User login successful, redirecting to /shop');
        console.log('User session:', session.user);
        return res.redirect('/shop');
      }

    } catch (error) {
      console.error('Error en login:', error);
      return res.render('auth/login', {
        title: 'Iniciar Sesión - Tattoo Shop',
        error: 'Error interno del servidor'
      });
    }
  }

  @Post('register')
  async register(
    @Req() req: Request,
    @Session() session: any,
    @Res() res: Response
  ) {
    try {
      // Obtener datos del cuerpo de la petición sin validación automática
      const rawBody = req.body;
      
      console.log('Raw body received:', rawBody);
      
      const username = rawBody.username?.toString().trim() || '';
      const email = rawBody.email?.toString().trim() || '';
      const password = rawBody.password?.toString() || '';
      const confirmPassword = rawBody.confirmPassword?.toString() || '';
      const firstName = rawBody.firstName?.toString().trim() || '';
      const lastName = rawBody.lastName?.toString().trim() || '';
      const telefono = rawBody.telefono?.toString().trim() || '';

      console.log('Parsed data:', { username, email, firstName, lastName });

      // Validaciones manuales
      if (!username) {
        return res.render('auth/register', {
          title: 'Crear Cuenta - Tattoo Shop',
          error: 'El nombre de usuario es requerido'
        });
      }

      if (!firstName) {
        return res.render('auth/register', {
          title: 'Crear Cuenta - Tattoo Shop',
          error: 'El nombre es requerido'
        });
      }

      if (!lastName) {
        return res.render('auth/register', {
          title: 'Crear Cuenta - Tattoo Shop',
          error: 'El apellido es requerido'
        });
      }

      if (!email) {
        return res.render('auth/register', {
          title: 'Crear Cuenta - Tattoo Shop',
          error: 'El email es requerido'
        });
      }

      if (!password) {
        return res.render('auth/register', {
          title: 'Crear Cuenta - Tattoo Shop',
          error: 'La contraseña es requerida'
        });
      }

      if (!confirmPassword) {
        return res.render('auth/register', {
          title: 'Crear Cuenta - Tattoo Shop',
          error: 'Debe confirmar la contraseña'
        });
      }

      // Validaciones
      if (password !== confirmPassword) {
        return res.render('auth/register', {
          title: 'Crear Cuenta - Tattoo Shop',
          error: 'Las contraseñas no coinciden'
        });
      }

      if (password.length < 6) {
        return res.render('auth/register', {
          title: 'Crear Cuenta - Tattoo Shop',
          error: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.render('auth/register', {
          title: 'Crear Cuenta - Tattoo Shop',
          error: 'El formato del email no es válido'
        });
      }

      // Verificar si ya existe el usuario
      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        return res.render('auth/register', {
          title: 'Crear Cuenta - Tattoo Shop',
          error: 'Ya existe una cuenta con este email'
        });
      }

      // Verificar si el username ya existe
      const existingUsername = await this.usersService.findByUsername(username);
      if (existingUsername) {
        return res.render('auth/register', {
          title: 'Crear Cuenta - Tattoo Shop',
          error: 'Este nombre de usuario ya está en uso'
        });
      }

      // Crear usuario
      const newUser = await this.usersService.create({
        username,
        email,
        password,
        firstName,
        lastName,
        telefono,
        role: UserRole.CUSTOMER,
        isActive: true
      });

      // Crear sesión automáticamente
      if (newUser) {
        session.user = {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          username: newUser.username
        };

        // Guardar sesión explícitamente
        await new Promise((resolve, reject) => {
          session.save((err) => {
            if (err) {
              console.error('Error al guardar la sesión:', err);
              reject(err);
            } else {
              console.log('Sesión guardada exitosamente después del registro');
              resolve(true);
            }
          });
        });

        console.log('New user registered, redirecting to /shop');
        console.log('User session:', session.user);
        return res.redirect('/shop');
      }

      throw new Error('No se pudo crear el usuario');

    } catch (error) {
      console.error('Error en registro:', error);
      return res.render('auth/register', {
        title: 'Crear Cuenta - Tattoo Shop',
        error: 'Error al crear la cuenta. Intenta nuevamente.'
      });
    }
  }

  @Post('logout')
  async logout(@Session() session: any, @Res() res: Response) {
    session.destroy((err: any) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
      }
      res.redirect('/');
    });
  }
}
