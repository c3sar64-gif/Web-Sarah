namespace Backend.DTOs
{
    public record CategoriaResponseDto(
        int Id,
        string Nombre,
        string? Descripcion
    );

    public record CreateCategoriaDto(
        string Nombre,
        string? Descripcion
    );

    public record UpdateCategoriaDto(
        int Id,
        string Nombre,
        string? Descripcion
    );
}
