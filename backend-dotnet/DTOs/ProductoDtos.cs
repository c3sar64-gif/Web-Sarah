namespace Backend.DTOs
{
    public record ProductoResponseDto(
        int Id,
        string Nombre,
        string? Descripcion,
        decimal Precio,
        int? CategoriaId,
        string? CategoriaNombre,
        string? ImagenUrl,
        bool Disponible
    );

    public record CreateProductoDto(
        string Nombre,
        string? Descripcion,
        decimal Precio,
        int? CategoriaId,
        string? ImagenUrl,
        bool Disponible = true
    );

    public record UpdateProductoDto(
        int Id,
        string Nombre,
        string? Descripcion,
        decimal Precio,
        int? CategoriaId,
        string? ImagenUrl,
        bool Disponible = true
    );
}
