import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';

export function setupHandlebars(app: NestExpressApplication) {
  // Configurar motor de plantillas
  app.setBaseViewsDir(join(__dirname, '..', '..', 'views'));
  app.setViewEngine('hbs');

  // Registrar helpers personalizados
  hbs.registerHelper('eq', function(a, b) {
    return a === b;
  });

  hbs.registerHelper('gt', function(a, b) {
    return a > b;
  });

  hbs.registerHelper('lt', function(a, b) {
    return a < b;
  });

  hbs.registerHelper('add', function(a, b) {
    return a + b;
  });

  hbs.registerHelper('sub', function(a, b) {
    return a - b;
  });

  hbs.registerHelper('multiply', function(a, b) {
    return a * b;
  });

  hbs.registerHelper('formatDate', function(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  });

  hbs.registerHelper('formatCurrency', function(amount) {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  });

  hbs.registerHelper('getStatusClass', function(status) {
    const classes = {
      draft: 'bg-secondary',
      pending: 'bg-warning',
      paid: 'bg-success',
      cancelled: 'bg-danger',
      overdue: 'bg-warning'
    };
    return classes[status] || 'bg-secondary';
  });

  hbs.registerHelper('getStatusText', function(status) {
    const texts = {
      draft: 'Borrador',
      pending: 'Pendiente',
      paid: 'Pagada',
      cancelled: 'Cancelada',
      overdue: 'Vencida'
    };
    return texts[status] || status;
  });

  hbs.registerHelper('range', function(start, end) {
    const result: number[] = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  });

  hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
  });

  hbs.registerHelper('capitalize', function(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  hbs.registerHelper('truncate', function(str, length) {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  });

  hbs.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });

  console.log('✅ Handlebars configurado con helpers personalizados');
}
