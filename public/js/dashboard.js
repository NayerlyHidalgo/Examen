// Dashboard de Facturación - JavaScript

// Variables globales
let currentInvoiceId = null;
let invoiceData = {};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadDashboardData();
});

// Inicializar dashboard
function initializeDashboard() {
    console.log('🎯 Inicializando Dashboard de Facturación');
    
    // Configurar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Configurar fecha actual en formularios
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Búsqueda en tiempo real
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }
    
    // Filtros
    const statusFilter = document.getElementById('status');
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    // Teclas de acceso rápido
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Cargar datos del dashboard
async function loadDashboardData() {
    try {
        // Aquí harías llamadas reales a la API
        console.log('📊 Cargando datos del dashboard...');
        
        // Simulación de carga
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('✅ Datos del dashboard cargados');
    } catch (error) {
        console.error('❌ Error cargando datos:', error);
        showNotification('Error cargando datos del dashboard', 'error');
    }
}

// Función de búsqueda
function performSearch() {
    const searchTerm = document.getElementById('search').value;
    console.log('🔍 Buscando:', searchTerm);
    
    // Aquí harías la llamada a la API de búsqueda
    // window.location.href = `/web/invoices?search=${encodeURIComponent(searchTerm)}`;
}

// Aplicar filtros
function applyFilters() {
    const status = document.getElementById('status').value;
    const limit = document.getElementById('limit').value;
    
    const params = new URLSearchParams(window.location.search);
    
    if (status) {
        params.set('status', status);
    } else {
        params.delete('status');
    }
    
    if (limit) {
        params.set('limit', limit);
    }
    
    window.location.href = `/web/invoices?${params.toString()}`;
}

// Marcar factura como pagada
function markAsPaid(invoiceId) {
    currentInvoiceId = invoiceId;
    const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
    modal.show();
}

// Confirmar pago
async function confirmPayment() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const paymentReference = document.getElementById('paymentReference').value;
    
    if (!paymentMethod) {
        showNotification('Debe seleccionar un método de pago', 'warning');
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`/invoices/${currentInvoiceId}/mark-as-paid`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentMethod,
                paymentReference
            })
        });
        
        if (response.ok) {
            showNotification('Factura marcada como pagada exitosamente', 'success');
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
            modal.hide();
            
            // Recargar página
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            throw new Error('Error al marcar como pagada');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al marcar la factura como pagada', 'error');
    } finally {
        showLoading(false);
    }
}

// Eliminar factura
async function deleteInvoice(invoiceId) {
    if (!confirm('¿Está seguro que desea eliminar esta factura?')) {
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`/invoices/${invoiceId}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            showNotification('Factura eliminada exitosamente', 'success');
            
            // Remover fila de la tabla
            const row = document.querySelector(`button[onclick="deleteInvoice('${invoiceId}')"]`).closest('tr');
            if (row) {
                row.remove();
            }
        } else {
            throw new Error('Error al eliminar');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar la factura', 'error');
    } finally {
        showLoading(false);
    }
}

// Exportar a Excel
function exportToExcel() {
    showNotification('Preparando archivo Excel...', 'info');
    
    // Aquí implementarías la exportación real
    setTimeout(() => {
        // Simular descarga
        const link = document.createElement('a');
        link.href = '/api/invoices/export/excel';
        link.download = `facturas_${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
        
        showNotification('Archivo Excel descargado', 'success');
    }, 2000);
}

// Imprimir lista
function printList() {
    window.print();
}

// Helpers de UI
function showLoading(show) {
    const elements = document.querySelectorAll('.card, .table');
    elements.forEach(element => {
        if (show) {
            element.classList.add('loading');
        } else {
            element.classList.remove('loading');
        }
    });
}

function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Función debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Atajos de teclado
function handleKeyboardShortcuts(event) {
    // Ctrl + N = Nueva factura
    if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        window.location.href = '/web/invoices/create';
    }
    
    // Ctrl + F = Buscar
    if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape = Cerrar modales
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });
    }
}

// Helpers de formato
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getStatusClass(status) {
    const classes = {
        draft: 'bg-secondary',
        pending: 'bg-warning',
        paid: 'bg-success',
        cancelled: 'bg-danger',
        overdue: 'bg-warning'
    };
    return classes[status] || 'bg-secondary';
}

function getStatusText(status) {
    const texts = {
        draft: 'Borrador',
        pending: 'Pendiente',
        paid: 'Pagada',
        cancelled: 'Cancelada',
        overdue: 'Vencida'
    };
    return texts[status] || status;
}

// Helpers de Handlebars (si se necesitan en el cliente)
if (typeof Handlebars !== 'undefined') {
    Handlebars.registerHelper('eq', function(a, b) {
        return a === b;
    });
    
    Handlebars.registerHelper('formatDate', function(date) {
        return formatDate(date);
    });
    
    Handlebars.registerHelper('getStatusClass', function(status) {
        return getStatusClass(status);
    });
    
    Handlebars.registerHelper('getStatusText', function(status) {
        return getStatusText(status);
    });
}

// Exportar funciones para uso global
window.InvoiceDashboard = {
    markAsPaid,
    deleteInvoice,
    exportToExcel,
    printList,
    showNotification,
    formatCurrency,
    formatDate
};

console.log('✅ Dashboard JavaScript inicializado');
