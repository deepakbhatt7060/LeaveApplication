using Microsoft.Win32;
using MongoDB.Bson;
using MongoDB.Driver;
using System;

namespace LeaveApplicationPortal
{
    public class DataConnectivity
    {
        private MongoClient connect = new MongoClient("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2");
        public Response EnterData(Datastruct sc)
        {
            try
            {
              
                var database = connect.GetDatabase("Register");
                var col = database.GetCollection<Datastruct>("Leaveapp");
                col.InsertOne(sc);
                Response a = new Response();
                a.Message = "Data Entered Successfully";
                a.Userdetails = new List<Datastruct> { sc };
                return a;
            }
            catch (MongoCommandException ex)
            {
                Response a = new Response();
                a.Message = "exception encountered" + ex.Message;

                return a;
            }

        }
        public List<Datastruct> ListDatas(string email)
        {
            var databases = connect.GetDatabase("Register");
            var col = databases.GetCollection<Datastruct>("Leaveapp");

            var filter = Builders<Datastruct>.Filter.Eq("EmailId", email);
            return col.Find(filter).ToList();
        }
        public List<Datastruct> ListDatasAgain(string email, string password)
        {
            var databases = connect.GetDatabase("Register");
            var col = databases.GetCollection<Datastruct>("Leaveapp");

            var filter = Builders<Datastruct>.Filter.Eq("EmailId", email) &
                         Builders<Datastruct>.Filter.Eq("Password", password);

            return col.Find(filter).ToList();
        }

        public List<Datastruct> Admindetails()
        {
            var databases = connect.GetDatabase("Register");
            var col = databases.GetCollection<Datastruct>("Leaveapp");
            return col.Find(_ => true).ToList();
        }

        public List<Datastruct> deleteaccount(string id)
        {
            var databases = connect.GetDatabase("Register");
            var col = databases.GetCollection<Datastruct>("Leaveapp");
            var filt = Builders<Datastruct>.Filter.Eq("_id", ObjectId.Parse(id));
            var sa = col.Find(filt).ToList();
            col.DeleteOne(filt);
            return sa;
        }

        // Function for updating password for the new user
        public UpdateResult updatedata(string password, string email)
        {
            var database = connect.GetDatabase("Register");
            var col = database.GetCollection<Datastruct>("Leaveapp");
            var filt = Builders<Datastruct>.Filter.Eq("EmailId", email);
            var update = Builders<Datastruct>.Update
                                            .Set("Password", password)
                                            .Set("Login", 1);
            var updateresult = col.UpdateOne(filt, update);
            return updateresult;
        }
        public List<Datastruct> updatefind(string email)
        {
            var databases = connect.GetDatabase("Register");
            var col = databases.GetCollection<Datastruct>("Leaveapp");
            var filt = Builders<Datastruct>.Filter.Eq("EmailId", email);
            return col.Find(filt).ToList();
        }

        public UpdateResult updatedLeave(string email, LeaveStatus leaveData)
{
    var database = connect.GetDatabase("Register");
    var col = database.GetCollection<Datastruct>("Leaveapp");
    var filt = Builders<Datastruct>.Filter.Eq("EmailId", email);
            var newLeaveStatusDocument = leaveData.ToBsonDocument();
            var update = Builders<Datastruct>.Update.Push("LeavesStatus", leaveData);

    var updateresult = col.UpdateOne(filt, update);
    return updateresult;
}


    }
}
