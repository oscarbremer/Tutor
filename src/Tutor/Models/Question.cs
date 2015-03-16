using System;

namespace Tutor.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public QuestionState QuestionState { get; set; }
        //public DateTime Created { get; set; }
        //public DateTime? Answered { get; set; }
    }
}