namespace HW_2.Models;

public class Message
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string Text { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly Time { get; set; }

}
