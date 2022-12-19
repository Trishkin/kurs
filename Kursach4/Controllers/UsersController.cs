using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kursach4.Context;
using Kursach4.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Web;
using System.IdentityModel.Tokens.Jwt;
using Kursach4.Helpers;
using Microsoft.AspNetCore.Identity;
using System.IO;
using Microsoft.AspNetCore.Authorization;

namespace Kursach4.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ParkingContext _context;

        public UsersController(ParkingContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
            {
                if (user is null)
                {
                    return BadRequest("Invalid client request");
                }
            var dbUser = _context.Users.FirstOrDefault(x => x.Email == user.Email.ToLower());
            var pas = PasswordHelper.GetMD5Hash(user.Password);
            if (dbUser != null && pas == dbUser.Password)
                {
                    var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"));
                    var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                    var tokeOptions = new JwtSecurityToken(
                        issuer: "https://localhost:30923",
                        audience: "https://localhost:30923",
                       // claims: new List<>(),
                        expires: DateTime.Now.AddHours(2),
                        signingCredentials: signinCredentials
                    );

                    var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);

                    return Ok(new AuthenticatedResponse { Token = tokenString, Id = dbUser.Id, User = dbUser.Firstname, Role = dbUser.Role });
                }

                return Unauthorized();
            }

        [HttpPost("registration")]
        public async Task<IActionResult> RegisterUser([FromBody] User userForRegistration)
        {
            var dbUser = _context.Users.FirstOrDefault(x =>  x.Email == userForRegistration.Email.ToLower() );
            if (dbUser == null)
            {
                userForRegistration.Role = "Client";
                userForRegistration.Password = PasswordHelper.GetMD5Hash(userForRegistration.Password);
                _context.Users.Add(userForRegistration);
                await _context.SaveChangesAsync();
                return StatusCode(201);
            }
            return BadRequest("Email exist");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<ViewUser>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }
            ViewUser viewUser = new ViewUser();
            viewUser.Email = user.Email;
            viewUser.Firstname = user.Firstname;
            viewUser.Lastname = user.Lastname;
            viewUser.Image = user.Image;
            return viewUser;
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, IFormFile img)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return BadRequest();
            }
            var file = HttpContext.Request.Form.Files.Count > 0 ? HttpContext.Request.Form.Files[0] : null;
            if (file != null && file.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    await file.CopyToAsync(ms);
                    var fileBytes = ms.ToArray();
                    user.Image = fileBytes;
                    _context.Entry(user).State = EntityState.Modified;
                    try
                    {
                        await _context.SaveChangesAsync();
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        if (!UserExists(id))
                        {
                            return NotFound();
                        }
                        else
                        {
                            throw;
                        }
                    }
                }

                return Ok(user.Image);
            }


            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
