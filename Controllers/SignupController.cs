using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace LeaveApplicationPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignupController : ControllerBase
    {
        static string namePattern = "^[a-zA-Z\\s]+$";
        static string emailPattern = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";
        static string passwordPattern = "^[a-zA-Z0-9]+$";
        Regex nam = new Regex(namePattern);
        Regex emai = new Regex(emailPattern);
        Regex passwrd = new Regex(passwordPattern);

        //API for creating the user account by admin to post data
        [HttpPost("create")]
        public Response Post([FromBody] Datastruct sc)
        {
            if (nam.IsMatch(sc.Name) && emai.IsMatch(sc.EmailId) && passwrd.IsMatch(sc.Password))
            {
                DataConnectivity abc = new DataConnectivity();
                return abc.EnterData(sc);
            }
            else
            {
                Response a = new Response();
                a.Message = "unable to enter data";
                return a;
            }

        }

        //API for otp validation
        [HttpPost("smtp")]
        public string Postit([FromBody] Emaildata data)
        {
            SmtpConnectivity abc = new SmtpConnectivity();
            abc.SendEmail(data);

            return "hello";
        }

        //API for reading data of particular user (used for reading data)
        [HttpGet("read")]
        public List<Datastruct> Get(string email)
        {
            DataConnectivity abc = new DataConnectivity();
            return abc.ListDatas(email);
        }

        //API for reading data of particular user (used for verification purpose)
        [HttpGet("reading")]
        public List<Datastruct> Getit(string email,string password)
        {
            DataConnectivity abc = new DataConnectivity();
            return abc.ListDatasAgain(email,password);
        }

        //API for reading all existing users i.e all the documents existing in the collection
        [HttpGet("readAdmin")]
        public List<Datastruct> Getadmindetails()
        {
            DataConnectivity abc = new DataConnectivity();
            return abc.Admindetails();
        }

        //API for deleting existing user account by admin
        [HttpDelete("deleteAccount")]
        public Response Delete([FromBody] string id)
        {
            DataConnectivity abc = new DataConnectivity();
            Response a = new Response();
            a.Message = "Data got Deleted";
            a.Userdetails = abc.deleteaccount(id);
            return a;

        }

        //API for updating password for the new user
        [HttpPut("update")]
        public Response Put([FromBody] Datastruct sc)
        {
                DataConnectivity abc = new DataConnectivity();
                abc.updatedata(sc.Password,sc.EmailId);
                Response a = new Response();
                a.Message = "Document got updated";
                a.Userdetails = abc.updatefind(sc.EmailId);
                return a;
            
        }
        
        //API for updating leave array in mongodb
        [HttpPut("updateleave")]
        public Response Enter([FromBody] RequestData requestData)
        {
            var check = new LeaveStatus
            {
                LeaveAccount = requestData.LeaveData.LeaveAccount,
                LeaveType = requestData.LeaveData.LeaveType,
                LeaveStartDate = requestData.LeaveData.LeaveStartDate,
                LeaveEndDate = requestData.LeaveData.LeaveStartDate,
                NoOfDaysLeave = requestData.LeaveData.NoOfDaysLeave,
                Status = requestData.LeaveData.Status,
                Description = requestData.LeaveData.Description,
            };
            DataConnectivity abc = new DataConnectivity();
            var updated = abc.updatedLeave(requestData.EmailId,check);
            Response response = new Response();
            response.Message = "Document got updated";
            return response;
        }


    }
}
