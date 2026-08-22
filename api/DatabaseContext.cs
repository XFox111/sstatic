using Microsoft.EntityFrameworkCore;
using SStatic.Shortener;

namespace SStatic;

/// <inheritdoc />
public class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
{
	/// <summary>
	/// Gets the set of tags.
	/// </summary>
	public DbSet<Tag> Tags => Set<Tag>();

	/// <summary>
	/// Gets the set of short links.
	/// </summary>
	public DbSet<ShortLink> ShortUrls => Set<ShortLink>();

	/// <inheritdoc />
	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<Tag>(tag =>
		{
			tag.ToTable("Tags");
			tag.HasKey(i => i.Id);
			tag.Property(i => i.Name).IsRequired().HasMaxLength(32);
			tag.Property(i => i.Color).IsRequired();
		});

		modelBuilder.Entity<ShortLink>(link =>
		{
			link.ToTable("Links");
			link.HasKey(i => i.Id);
			link.HasIndex(i => i.Slug).IsUnique();
			link.Property(i => i.Slug).UseCollation("NOCASE");
			link.Property(i => i.RedirectUrl).IsRequired();
			link.Property(i => i.ForwardQuery).HasDefaultValue(false);
			link.Property(i => i.CreatedAt).IsRequired();
			link.Property(i => i.UpdatedAt).IsRequired();
			link
				.HasMany(i => i.Tags)
				.WithMany()
				.UsingEntity("LinkTags");
		});

		base.OnModelCreating(modelBuilder);
	}
}
