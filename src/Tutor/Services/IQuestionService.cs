using System.Collections.Generic;
using System.Threading.Tasks;
using Tutor.Models;

namespace Tutor.Services
{
    public interface IQuestionService
    {
        Task<IEnumerable<Question>> GetAll();
        Task<int> Add(Question question);
        Task<Question> GetById(int id);
        Task Update(Question question);
        Task<bool> TryDelete(int id);
    }
}