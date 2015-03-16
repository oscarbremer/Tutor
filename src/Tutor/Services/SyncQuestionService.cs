using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tutor.Models;

namespace Tutor.Services
{
    public class SyncQuestionService : IQuestionService
    {
        private readonly ApplicationDbContext _dbContext;

        public SyncQuestionService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Question>> GetAll()
        {
            return _dbContext.Questions.Select(y => y);
        }

        public async Task<int> Add(Question question)
        {
            _dbContext.Questions.Add(question);
            _dbContext.SaveChanges();
            return question.Id;
        }

        public async Task<Question> GetById(int id)
        {
            throw new NotImplementedException();
        }

        public async Task Update(Question question)
        {
            var dbQuestion = _dbContext.Questions.SingleOrDefault(y => y.Id == question.Id);
            if (dbQuestion != null)
            {
                dbQuestion.Description = question.Description;
                dbQuestion.Name = question.Name;
                dbQuestion.QuestionState = question.QuestionState;
                dbQuestion.Location = question.Location;
                _dbContext.SaveChanges();
            }
        }
        public async Task<bool> TryDelete(int id)
        {
            var question = _dbContext.Questions.SingleOrDefault(y => y.Id == id);
            if (question == null)
                return false;
            _dbContext.Questions.Remove(question);
            _dbContext.SaveChanges();
            return true;
        }
    }
}