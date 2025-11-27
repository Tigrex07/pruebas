using System;
using System.ComponentModel.DataAnnotations;

namespace MachineShopApi.DTOs
{
    // Representa los detalles de una revisión de ingeniería, combinando
    // información de Revision, Solicitud y la última operación de EstadoTrabajo.
    public class RevisionDetailsDto
    {
        // Propiedades básicas de la Revisión
        public int Id { get; set; }
        public int IdSolicitud { get; set; }
        public DateTime FechaHoraRevision { get; set; }
        public string? Comentarios { get; set; }

        // Propiedades mapeadas desde el controlador:

        // 1. Mapeo de la Prioridad (desde Revision.Prioridad)
        [MaxLength(20)]
        public string PrioridadActual { get; set; } = string.Empty;

        // 2. Mapeo del Maquinista (desde la última Operación)
        public string? MaquinistaAsignado { get; set; }

        // 3. Mapeo del Estado Operacional (desde la última Operación)
        public string? EstadoOperacional { get; set; }

        // 4. Mapeo de Notas de Ingeniería (desde Revision.Comentarios)
        public string? NotasIngenieria { get; set; }

        // Puedes añadir más propiedades de la Solicitud si las necesitas en la vista (ej. Nombre del Solicitante, Descripción de la Pieza, etc.)
        // public string NombreSolicitante { get; set; } = string.Empty;
    }
}