import React, { useState, useMemo } from 'react';
import { FileText, Trash2, Search, AlertTriangle, List, Clock, CheckCircle, Hourglass, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

// --- MOCK DATA (Simula la información que vendría de un API) ---
const MOCK_SOLICITUDES = [
    { id: '2025-001', pieza: 'Molde Inyección #45', maquina: 'INJ-03', area: 'Plásticos', tipo: 'Daño físico', prioridad: 'Media', estado: 'En proceso', solicitante: 'Ana Lopez', fecha: '2025-10-25', diasAbierto: 25 },
    { id: '2025-002', pieza: 'Prensa #12 Insert', maquina: 'PRE-12', area: 'Metalurgia', tipo: 'Ajuste de tolerancia', prioridad: 'Alta', estado: 'Pendiente', solicitante: 'Luis Garcia', fecha: '2025-11-10', diasAbierto: 10 },
    { id: '2025-003', pieza: 'Guía de Eje', maquina: 'CNC-05', area: 'Mantenimiento', tipo: 'Fabricación', prioridad: 'Baja', estado: 'Completado', solicitante: 'Maria Soto', fecha: '2025-10-01', diasAbierto: 5 },
    { id: '2025-004', pieza: 'Electrodo Cobre', maquina: 'EDM-01', area: 'Moldes', tipo: 'Daño físico', prioridad: 'Urgente', estado: 'En proceso', solicitante: 'Javier P.', fecha: '2025-11-15', diasAbierto: 5 },
    { id: '2025-005', pieza: 'Conector J3', maquina: 'INJ-08', area: 'Plásticos', tipo: 'Modificación', prioridad: 'Media', estado: 'Completado', solicitante: 'Ana Lopez', fecha: '2025-11-01', diasAbierto: 10 },
    { id: '2025-006', pieza: 'Engrane Reductor', maquina: 'TOR-02', area: 'Metalurgia', tipo: 'Fabricación', prioridad: 'Alta', estado: 'Pendiente', solicitante: 'Luis Garcia', fecha: '2025-11-18', diasAbierto: 2 },
    { id: '2025-007', pieza: 'Molde Base', maquina: 'INJ-01', area: 'Plásticos', tipo: 'Mantenimiento preventivo', prioridad: 'Baja', estado: 'Completado', solicitante: 'Maria Soto', fecha: '2025-10-20', diasAbierto: 8 },
];

// --- Componente Td ---
function Td({ children, className = "" }) {
    return (
        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-800 ${className}`}>
            {children}
        </td>
    );
}

// --- Lógica de colores para Prioridad ---
const getPriorityClasses = (priority) => {
    const base = "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border tracking-wider";
    switch (priority) {
        case "Urgente": return `${base} text-white bg-red-600 font-bold border-red-700`;
        case "Alta": return `${base} text-red-700 bg-red-100 font-medium border-red-200`;
        case "Media": return `${base} text-yellow-700 bg-yellow-100 font-medium border-yellow-200`;
        case "Baja": return `${base} text-green-700 bg-green-100 font-medium border-green-200`;
        default: return `${base} text-gray-700 bg-gray-100 border-gray-200`;
    }
};

// --- Lógica de colores para Estado ---
const getStatusClasses = (status) => {
    switch (status) {
        case "Pendiente": return "bg-red-50 text-red-700 border-red-400";
        case "En proceso": return "bg-indigo-50 text-indigo-700 border-indigo-400";
        case "Completado": return "bg-green-50 text-green-700 border-green-400";
        default: return "bg-gray-50 text-gray-700 border-gray-400";
    }
};

// --- Componente KpiCard ---
function KpiCard({ title, value, icon, colorClasses, footerText, trendIcon }) {
    return (
        <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${colorClasses.border} transition duration-300 hover:shadow-xl`}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                {React.cloneElement(icon, { size: 24, className: colorClasses.text })}
            </div>
            <div className="mt-2 flex items-baseline">
                <h2 className="text-3xl font-extrabold text-gray-900">{value}</h2>
                {/* Se añade la tendencia solo si hay un icono de tendencia */}
                {trendIcon && (
                    <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses.trendBg} ${colorClasses.trendText}`}>
                        {trendIcon}
                        <span className="ml-1">{footerText}</span>
                    </span>
                )}
            </div>
            {!trendIcon && ( // Si no hay trend, se usa el footerText para info
                 <p className="mt-4 text-xs text-gray-500">{footerText}</p>
            )}
        </div>
    );
}

// --- Componente TableRow ---
function TableRow({ id, pieza, maquina, area, tipo, prioridad, estado, solicitante, fecha, handleViewDetails, diasAbierto }) {
    const handleAction = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evita que el click en la fila dispare la acción de la celda.
        handleViewDetails(id);
    };

    return (
        <tr 
            className="border-b border-gray-200 hover:bg-indigo-50 transition duration-100 cursor-pointer"
            onClick={handleAction}
        >
            <Td className="font-semibold text-gray-900">{id}</Td>
            <Td>{pieza}</Td>
            <Td className="text-gray-500 italic">{maquina}</Td>
            <Td>{area}</Td>
            <Td>
                 <span className={`${getPriorityClasses(prioridad)}`}>
                    {prioridad}
                </span>
            </Td>
            <Td>
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusClasses(estado)}`}>
                    {estado}
                </span>
            </Td>
            <Td className="text-gray-700">{solicitante || "—"}</Td>
            <Td className="text-gray-500">{fecha}</Td>
            {/* KPI adicional en la tabla */}
            <Td className={`font-medium ${diasAbierto > 20 ? 'text-red-600' : 'text-green-600'}`}>{diasAbierto} días</Td>
            <Td>
                <div className="flex gap-2">
                    <button
                        title="Ver Detalles"
                        onClick={handleAction}
                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-100 transition"
                    >
                        <FileText size={18} />
                    </button>
                    <button
                        title="Eliminar orden (Solo Admin)"
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition"
                        onClick={(e) => e.stopPropagation()} // Detiene el evento de propagación para no ir a detalles
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </Td>
        </tr>
    );
}

// --- COMPONENTE PRINCIPAL (DASHBOARD) ---
export default function Dashboard() {
    const [solicitudes] = useState(MOCK_SOLICITUDES); // Usamos el mock data
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("Todos");

    // --- Lógica de Cálculo de KPIs ---
    const kpis = useMemo(() => {
        const total = solicitudes.length;
        const enProceso = solicitudes.filter(s => s.estado === 'En proceso').length;
        const pendiente = solicitudes.filter(s => s.estado === 'Pendiente').length;
        const completado = solicitudes.filter(s => s.estado === 'Completado').length;
        
        // Simulación de tiempo promedio y tendencia
        const avgDays = solicitudes.reduce((acc, s) => acc + s.diasAbierto, 0) / total;
        const trendIcon = <TrendingUp size={16} />; // Simulación de tendencia positiva

        return {
            total,
            enProceso,
            pendiente,
            completado,
            avgDays: avgDays ? avgDays.toFixed(1) : 0,
            trendIcon
        };
    }, [solicitudes]);

    // --- Lógica de Filtrado de Reportes ---
    const filteredReports = useMemo(() => {
        let tempReports = solicitudes;

        // 1. Filtrado por Estado
        if (filterStatus !== "Todos") {
            tempReports = tempReports.filter(report => report.estado === filterStatus);
        }

        // 2. Búsqueda por término (ID, Pieza, Solicitante)
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            tempReports = tempReports.filter(report =>
                report.id.toLowerCase().includes(lowerCaseSearch) ||
                report.pieza.toLowerCase().includes(lowerCaseSearch) ||
                report.solicitante.toLowerCase().includes(lowerCaseSearch)
            );
        }

        return tempReports;
    }, [solicitudes, searchTerm, filterStatus]);

    // Función de manejo de la acción de ver detalles (simulación)
    const handleViewDetails = (id) => {
        console.log(`Navegando a los detalles de la solicitud con ID: ${id}`);
        alert(`Simulación: Ver detalles de la Solicitud ID: ${id}`);
    };

    return (
        <div className="space-y-8">
            {/* --- 1. SECCIÓN DE KPI CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* KPI 1: Total de Solicitudes */}
                <KpiCard
                    title="Total Solicitudes"
                    value={kpis.total}
                    icon={<BarChart3 />}
                    colorClasses={{ border: "border-indigo-500", text: "text-indigo-600", trendBg: "bg-indigo-100", trendText: "text-indigo-800" }}
                    footerText="Total de registros en el sistema"
                />

                {/* KPI 2: En Proceso */}
                <KpiCard
                    title="En Proceso"
                    value={kpis.enProceso}
                    icon={<Hourglass />}
                    colorClasses={{ border: "border-yellow-500", text: "text-yellow-600", trendBg: "bg-yellow-100", trendText: "text-yellow-800" }}
                    footerText={`${((kpis.enProceso / kpis.total) * 100 || 0).toFixed(0)}% del total`}
                />

                {/* KPI 3: Pendientes (Críticos) */}
                <KpiCard
                    title="Pendientes / Críticos"
                    value={kpis.pendiente}
                    icon={<AlertTriangle />}
                    colorClasses={{ border: "border-red-500", text: "text-red-600", trendBg: "bg-red-100", trendText: "text-red-800" }}
                    footerText={`${kpis.pendiente} solicitudes esperando asignación`}
                />

                 {/* KPI 4: Tiempo Promedio de Resolución */}
                <KpiCard
                    title="Días Promedio (TTR)"
                    value={kpis.avgDays}
                    icon={<Clock />}
                    colorClasses={{ border: "border-green-500", text: "text-green-600", trendBg: "bg-green-100", trendText: "text-green-800" }}
                    footerText={`Días promedio hasta Completado`}
                    trendIcon={kpis.trendIcon}
                />
            </div>

            {/* --- 2. SECCIÓN DE TABLA DE REPORTES --- */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <List size={20} className="mr-2 text-indigo-600" />
                        Listado de Solicitudes
                    </h2>
                    
                    {/* Controles de Búsqueda y Filtro */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                         {/* Filtro por Estado */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="Todos">Filtrar por Estado...</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="En proceso">En proceso</option>
                            <option value="Completado">Completado</option>
                        </select>
                        
                        {/* Búsqueda */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por ID, Pieza o Solicitante..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 pl-10 border border-gray-300 rounded-lg text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pieza</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Máquina</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Días Abierto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Aquí se muestran los datos (filteredReports) */}
                            {filteredReports.length > 0 ? (
                                filteredReports.map((report) => (
                                    <TableRow 
                                        key={report.id} 
                                        {...report} 
                                        handleViewDetails={handleViewDetails}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <Td colSpan="10" className="text-center py-8 text-gray-500">
                                        <AlertTriangle size={24} className="mx-auto mb-2 text-yellow-500"/>
                                        No se encontraron reportes que coincidan con la búsqueda.
                                    </Td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Se usa el operador de encadenamiento opcional para evitar el error 'reading length' */}
                <p className="text-sm text-gray-600 mt-4">Mostrando {filteredReports.length} de {solicitudes?.length || 0} solicitudes.</p>
            </div>
        </div>
    );
}