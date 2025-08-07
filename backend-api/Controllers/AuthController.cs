using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceMM.Api.Data;
using EcommerceMM.Api.DTOs;
using EcommerceMM.Api.Models;
using EcommerceMM.Api.Services;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace EcommerceMM.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableRateLimiting("AuthPolicy")]
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
                // Validação básica
                if (string.IsNullOrWhiteSpace(loginDto.Username) || string.IsNullOrWhiteSpace(loginDto.Password))
                {
                    return BadRequest(new LoginResponseDto
                    {
                        Success = false,
                        Message = "Username e password são obrigatórios"
                    });
                }

                // Buscar admin
                var admin = await _context.Admins
                    .FirstOrDefaultAsync(a => a.Username == loginDto.Username && a.IsActive);

                if (admin == null)
                {
                    // Delay para mitigar ataques de force brute
                    await Task.Delay(1000);
                    return Ok(new LoginResponseDto
                    {
                        Success = false,
                        Message = "Usuário ou senha inválidos"
                    });
                }

                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, admin.PasswordHash))
                {
                    // Log de tentativa de login inválida
                    _logger.LogWarning("Invalid login attempt for user: {Username} from IP: {IP}", 
                        loginDto.Username, HttpContext.Connection.RemoteIpAddress);
                    
                    await Task.Delay(1000);
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

                _logger.LogInformation("Successful login for user: {Username}", admin.Username);

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
