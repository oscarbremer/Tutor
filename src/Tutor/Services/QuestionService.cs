using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tutor.Models;

namespace Tutor.Services
{
    public class QuestionService :IQuestionService
    {
        private readonly ApplicationDbContext _dbContext;

        public QuestionService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Question>> GetAll()
        {
            return await Task.FromResult(_dbContext.Questions.Select(y => y));
        }

        public async Task Add(Question question)
        {
            _dbContext.Questions.Add(question);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Question> GetById(int id)
        {
            throw new NotImplementedException();
        }

        public async Task Update(Question question)
        {
            var singleOrDefault = _dbContext.Questions.SingleOrDefaultAsync(y => y.Id == question.Id);
            if (singleOrDefault != null)
            {
                var dbQuestion = await singleOrDefault;
                dbQuestion.Description = question.Description;
                dbQuestion.Name = question.Name;
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<bool> TryDelete(int id)
        {
            var singleOrDefault = _dbContext.Questions.SingleOrDefaultAsync(y => y.Id == id);
            if (singleOrDefault == null)
                return false;
            var question = await singleOrDefault;
            _dbContext.Questions.Remove(question);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}