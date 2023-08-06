using MongoDB.Bson.Serialization.Attributes;

namespace LeaveApplicationPortal
{
    public class LeaveStatus
    {
        public string? LeaveType { get; set; }
        public string? LeaveAccount { get; set; }
        public string? LeaveStartDate { get; set; }
        public string? LeaveEndDate { get; set; }
        public int NoOfDaysLeave { get; set; }
        public string? Status { get; set; }
        public string? Description { get; set; }
    }
   
    public class LeavesAvailable
    {
        public int PersonalLeaves { get; set; }
        public int OptionalLeaves { get; set; }
        public int SickLeaves { get; set; }
        public int TotalLeaves { get; set; }
        public int MaternityLeaves { get; set; }
        public int PaternityLeaves { get; set; }
        public int WeddingLeaves { get; set; }
        public int BirthdayLeaves { get; set; }
        public int AnnualLeaves { get; set; }
        public int remoteWorking { get; set; }
        public int LossOfPay { get; set; }
        public int compassionateLeaves { get; set; }
        public int compensatoryLeaves { get; set; }
        public int covidLeaves { get; set; }
    }

    public class Datastruct
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? EmployeeId { get; set; }

        public string? Name { get; set; }
        public string? EmailId { get; set; }
        public string? Password { get; set; }
        public string? Designation { get; set; }
        public DateTime Dateofjoining { get; set; }
        public LeavesAvailable? LeavesAvailable { get; set; }
        public LeaveStatus[]? LeavesStatus { get; set; }
        public string? Manager { get; set; }
        public string? ManagerEmailId { get; set; }
        public string? LeaveApplied { get; set; }
        public int LeaveCount { get; set; }
        public string? Authority { get; set; }

        public int Login { get; set; }
    }
}

