using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Infrastructure;
using Tutor.Hubs;
using Tutor.Models;
using Tutor.Services;

namespace Tutor.Controllers
{
    [Route("api/tutor/[action]")]
    public class TutorController : Controller
    {
        private readonly IHubContext _hub;
        private readonly IQuestionService _questionService;

        public TutorController(IConnectionManager connectionManager, IQuestionService questionService )
        {
            _hub = connectionManager.GetHubContext<QuestionHub>();
            _questionService = questionService;
        }

        [HttpGet("~/api/tutor")]
        public async Task<IEnumerable<Question>> Get()
        {
            var questions = await _questionService.GetAll();
            return questions;
        }

        [HttpPost("~/api/tutor")]
        public async void Add(Question question)
        {
             await _questionService.Add(question);
            _hub.Clients.All.broadcastQuestion(question.Name, question.Description, question.Location);

        }

        [HttpDelete("~/api/tutor")]
        public async void Delete(int id)
        {
            var deleted = await _questionService.TryDelete(id);
        }

        [HttpPut("~/api/tutor")]
        public async void Update(Question question)
        {
            await _questionService.Update(question);
            _hub.Clients.All.updateQuestion(question);
        }
    }
}