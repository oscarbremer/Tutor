using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Tutor.Services;

namespace Tutor.Controllers
{
    public class HomeController : Controller
    {
        private readonly IQuestionService _questionService;

        public HomeController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        public async Task<IActionResult> Index()
        {
            var questions = await _questionService.GetAll();
            return View(questions);
        }
    }
}