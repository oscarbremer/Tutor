using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Tutor.Services;

namespace Tutor.Controllers
{
    public class HomeController : Controller
    {
        //private readonly IQuestionService _questionService;

        //public HomeController(IQuestionService questionService)
        //{
        //    _questionService = questionService;
        //}

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Tutor()
        {
            return View();
        }
    }
}