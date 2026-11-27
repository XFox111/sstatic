namespace SStatic.StaticFiles;

/// <summary>
/// File storage item details (can be either <see cref="FileDetails"/> or <see cref="DirectoryDetails"/>)
/// </summary>
public readonly union ItemDetails(FileDetails, DirectoryDetails);
