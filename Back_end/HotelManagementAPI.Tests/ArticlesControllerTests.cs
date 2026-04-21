using System.Security.Claims;
using HotelManagementAPI.Controllers;
using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace HotelManagementAPI.Tests;

public class ArticlesControllerTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly Mock<ISlugService> _slugServiceMock;
    private readonly Mock<ICloudinaryService> _cloudinaryServiceMock;
    private readonly ArticlesController _controller;

    public ArticlesControllerTests()
    {
        // Setup InMemory Database
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new AppDbContext(options);

        // Setup Mocks
        _slugServiceMock = new Mock<ISlugService>();
        _cloudinaryServiceMock = new Mock<ICloudinaryService>();

        _controller = new ArticlesController(_context, _slugServiceMock.Object, _cloudinaryServiceMock.Object);

        // Setup Mock User for Authorization
        var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.NameIdentifier, "1")
        }, "mock"));

        _controller.ControllerContext = new ControllerContext()
        {
            HttpContext = new DefaultHttpContext() { User = user }
        };
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction_WithValidData()
    {
        // Arrange
        var category = new ArticleCategory { Id = 1, Name = "Tech", IsActive = true };
        _context.ArticleCategories.Add(category);
        await _context.SaveChangesAsync();

        var dto = new CreateArticleDto("Test Article", "Test Content", 1);

        _slugServiceMock.Setup(s => s.GenerateUniqueSlugAsync("Test Article", null))
            .ReturnsAsync("test-article");

        // Act
        var result = await _controller.Create(dto);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal("GetBySlug", createdResult.ActionName);
        var value = createdResult.Value;
        Assert.NotNull(value);
        
        var articleInDb = await _context.Articles.FirstOrDefaultAsync();
        Assert.NotNull(articleInDb);
        Assert.Equal("Test Article", articleInDb.Title);
        Assert.Equal("test-article", articleInDb.Slug);
        Assert.Equal(1, articleInDb.AuthorId);
    }

    [Fact]
    public async Task Update_ReturnsOkResult_WhenArticleExists()
    {
        // Arrange
        var article = new Article
        {
            Id = 1,
            Title = "Old Title",
            Slug = "old-title",
            Content = "Old Content",
            CategoryId = 1,
            IsActive = true
        };
        _context.Articles.Add(article);
        await _context.SaveChangesAsync();

        var dto = new UpdateArticleDto("New Title", "New Content", 2);

        _slugServiceMock.Setup(s => s.GenerateUniqueSlugAsync("New Title", 1))
            .ReturnsAsync("new-title");

        // Act
        var result = await _controller.Update(1, dto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var updatedArticle = Assert.IsType<Article>(okResult.Value);
        Assert.Equal("New Title", updatedArticle.Title);
        Assert.Equal("new-title", updatedArticle.Slug);
        Assert.Equal("New Content", updatedArticle.Content);
        Assert.Equal(2, updatedArticle.CategoryId);
    }

    [Fact]
    public async Task Delete_ReturnsOkResult_SoftDeletesArticle()
    {
        // Arrange
        var article = new Article
        {
            Id = 1,
            Title = "To Delete",
            IsActive = true
        };
        _context.Articles.Add(article);
        await _context.SaveChangesAsync();

        // Act
        var result = await _controller.Delete(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        
        var articleInDb = await _context.Articles.FindAsync(1);
        Assert.NotNull(articleInDb);
        Assert.False(articleInDb.IsActive); // Verify soft delete
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
