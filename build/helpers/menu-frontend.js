"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenuFrontEnd = void 0;
const getMenuFrontEnd = (role = 'USER_ROLE') => {
    const menu = [
        {
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Inicio', url: '' },
                { titulo: 'Mapa del Sitio', url: '/inicio/mapa-sitio' },
                // {titulo:'ProgressBar',url: 'progress'},
                // {titulo:'Graficas',url: 'grafica1'},
                // {titulo:'Promesas',url: 'promesas'},
                // {titulo:'Rxjs',url: 'rxjs'},
            ],
            busqueda: [
                { titulo: 'Mapa del Sitio', url: '/inicio/mapa-sitio' },
                { titulo: 'Inicio', url: '/inicio' },
                // {titulo:'Mapa del Sitio',url: '/dashboard/mapa-sitio'},
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folfer-lock-open',
            submenu: [
                // { titulo: 'Usuarios', url: 'usuarios' },
                { titulo: 'Hospitales', url: '/inicio/hospitales' },
                { titulo: 'Médicos', url: '/inicio/médicos' },
            ],
            busqueda: [
                { titulo: 'Crear Hospital', url: ['hospital', 'nuevo'] },
                { titulo: 'Editar Hospital', url: 'hospitales' },
                { titulo: 'Hospital', url: 'hospitales' },
                { titulo: 'Crear Médicos', url: ['medico', 'nuevo'] },
                { titulo: 'Editar Médicos', url: 'médicos' },
                { titulo: 'Médicos', url: 'médicos' },
            ]
        }
    ];
    if (role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/inicio/usuarios' });
    }
    return menu;
};
exports.getMenuFrontEnd = getMenuFrontEnd;
