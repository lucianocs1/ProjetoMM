using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceMM.Api.Data;
using EcommerceMM.Api.DTOs;
using EcommerceMM.Api.Models;
using EcommerceMM.Api.Services;

namespace EcommerceMM.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly EcommerceDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(EcommerceDbContext context, IJwtService jwtService, ILogger<AuthController> logger)
        {
            _context = context;
            _jwtService = jwtService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var admin = await _context.Admins
                    .FirstOrDefaultAsync(a => a.Username == loginDto.Username && a.IsActive);

                if (admin == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, admin.PasswordHash))
                {
                    return Ok(new LoginResponseDto
                    {
                        Success = false,
                        Message = "Usuário ou senha inválidos"
                    });
                }

                // Atualizar último login
                admin.LastLogin = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var token = _jwtService.GenerateToken(admin);

                return Ok(new LoginResponseDto
                {
                    Success = true,
                    Message = "Login realizado com sucesso",
                    Token = token,
                    Admin = new AdminDto
                    {
                        Id = admin.Id,
                        Username = admin.Username,
                        Email = admin.Email,
                        LastLogin = admin.LastLogin
                    }
                });
            }
            catch (Exception ex)
            {
                // Log do erro com nível apropriado
                _logger.LogError(ex, "Erro durante processo de login para usuário: {Username}", loginDto.Username);
                
                return StatusCode(500, new LoginResponseDto
                {
                    Success = false,
                    Message = "Erro interno do servidor"
                });
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Em uma implementação mais robusta, você invalidaria o token
            return Ok(new { Success = true, Message = "Logout realizado com sucesso" });
        }

        [HttpGet("verify")]
        public IActionResult VerifyToken()
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader == null || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized();
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();
            var principal = _jwtService.ValidateToken(token);

            if (principal == null)
            {
                return Unauthorized();
            }

            return Ok(new { Valid = true });
        }
    }
}
