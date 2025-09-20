import requests
import sys
import json
from datetime import datetime, timedelta
import uuid

class MindMateAPITester:
    def __init__(self, base_url="https://mindmate-25.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.student_token = None
        self.counsellor_token = None
        self.student_user = None
        self.counsellor_user = None
        self.tests_run = 0
        self.tests_passed = 0
        self.session_id = None
        self.group_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        
        if headers:
            default_headers.update(headers)
        
        # Remove Content-Type for file uploads
        if files:
            default_headers.pop('Content-Type', None)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers)
            elif method == 'POST':
                if files:
                    response = requests.post(url, data=data, files=files, headers=default_headers)
                else:
                    response = requests.post(url, json=data, headers=default_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=default_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=default_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_student_registration(self):
        """Test student registration"""
        student_data = {
            "email": f"student_{uuid.uuid4().hex[:8]}@test.com",
            "username": f"student_{uuid.uuid4().hex[:8]}",
            "full_name": "Test Student",
            "password": "testpass123",
            "user_type": "student",
            "bio": "Test student bio"
        }
        
        success, response = self.run_test(
            "Student Registration",
            "POST",
            "auth/register",
            200,
            data=student_data
        )
        
        if success and 'access_token' in response:
            self.student_token = response['access_token']
            self.student_user = response['user']
            return True
        return False

    def test_counsellor_registration(self):
        """Test counsellor registration"""
        counsellor_data = {
            "email": f"counsellor_{uuid.uuid4().hex[:8]}@test.com",
            "username": f"counsellor_{uuid.uuid4().hex[:8]}",
            "full_name": "Test Counsellor",
            "password": "testpass123",
            "user_type": "counsellor",
            "bio": "Licensed mental health counsellor",
            "specializations": ["anxiety", "depression"]
        }
        
        success, response = self.run_test(
            "Counsellor Registration",
            "POST",
            "auth/register",
            200,
            data=counsellor_data
        )
        
        if success and 'access_token' in response:
            self.counsellor_token = response['access_token']
            self.counsellor_user = response['user']
            return True
        return False

    def test_login(self):
        """Test login with student credentials"""
        if not self.student_user:
            return False
            
        login_data = {
            "email": self.student_user['email'],
            "password": "testpass123"
        }
        
        success, response = self.run_test(
            "Student Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        return success

    def test_get_current_user(self):
        """Test getting current user info"""
        headers = {'Authorization': f'Bearer {self.student_token}'}
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200,
            headers=headers
        )
        return success

    def test_search_users(self):
        """Test user search functionality"""
        headers = {'Authorization': f'Bearer {self.student_token}'}
        success, response = self.run_test(
            "Search Users",
            "GET",
            "users/search?q=test",
            200,
            headers=headers
        )
        return success

    def test_get_counsellors(self):
        """Test getting list of counsellors"""
        success, response = self.run_test(
            "Get Counsellors",
            "GET",
            "users/counsellors",
            200
        )
        return success

    def test_create_session(self):
        """Test session booking"""
        if not self.counsellor_user:
            return False
            
        session_data = {
            "counsellor_id": self.counsellor_user['id'],
            "title": "Test Counselling Session",
            "description": "Test session for anxiety management",
            "session_date": (datetime.now() + timedelta(days=1)).isoformat(),
            "duration_minutes": 60,
            "session_type": "video"
        }
        
        headers = {'Authorization': f'Bearer {self.student_token}'}
        success, response = self.run_test(
            "Create Session",
            "POST",
            "sessions",
            200,
            data=session_data,
            headers=headers
        )
        
        if success and 'id' in response:
            self.session_id = response['id']
            return True
        return False

    def test_get_sessions(self):
        """Test getting user sessions"""
        headers = {'Authorization': f'Bearer {self.student_token}'}
        success, response = self.run_test(
            "Get User Sessions",
            "GET",
            "sessions",
            200,
            headers=headers
        )
        return success

    def test_create_group(self):
        """Test creating a support group"""
        headers = {'Authorization': f'Bearer {self.student_token}'}
        
        form_data = {
            'name': 'Test Support Group',
            'description': 'A test support group for anxiety',
            'group_type': 'support',
            'is_public': True
        }
        
        # Use files parameter to send as form data
        success, response = self.run_test(
            "Create Group",
            "POST",
            "groups",
            200,
            data=form_data,
            headers=headers,
            files={}  # This forces form-data encoding
        )
        
        if success and 'id' in response:
            self.group_id = response['id']
            return True
        return False

    def test_get_groups(self):
        """Test getting groups"""
        headers = {'Authorization': f'Bearer {self.student_token}'}
        success, response = self.run_test(
            "Get Groups",
            "GET",
            "groups",
            200,
            headers=headers
        )
        return success

    def test_join_group(self):
        """Test joining a group"""
        if not self.group_id:
            return False
            
        headers = {'Authorization': f'Bearer {self.counsellor_token}'}
        success, response = self.run_test(
            "Join Group",
            "POST",
            f"groups/{self.group_id}/join",
            200,
            headers=headers
        )
        return success

    def test_send_message(self):
        """Test sending a message to group"""
        if not self.group_id:
            return False
            
        headers = {'Authorization': f'Bearer {self.student_token}'}
        headers.pop('Content-Type', None)
        
        form_data = {
            'content': 'Hello everyone! This is a test message.',
            'group_id': self.group_id
        }
        
        success, response = self.run_test(
            "Send Group Message",
            "POST",
            "messages",
            200,
            data=form_data,
            headers=headers
        )
        return success

    def test_get_group_messages(self):
        """Test getting group messages"""
        if not self.group_id:
            return False
            
        headers = {'Authorization': f'Bearer {self.student_token}'}
        success, response = self.run_test(
            "Get Group Messages",
            "GET",
            f"groups/{self.group_id}/messages",
            200,
            headers=headers
        )
        return success

    def test_get_conversations(self):
        """Test getting conversations"""
        headers = {'Authorization': f'Bearer {self.student_token}'}
        success, response = self.run_test(
            "Get Conversations",
            "GET",
            "messages/conversations",
            200,
            headers=headers
        )
        return success

    def test_get_quizzes(self):
        """Test getting available quizzes"""
        success, response = self.run_test(
            "Get Quizzes",
            "GET",
            "quizzes",
            200
        )
        return success

    def test_record_mood(self):
        """Test mood tracking"""
        headers = {'Authorization': f'Bearer {self.student_token}'}
        headers.pop('Content-Type', None)
        
        form_data = {
            'mood': 'happy',
            'emoji': '😊'
        }
        
        success, response = self.run_test(
            "Record Mood",
            "POST",
            "mood",
            200,
            data=form_data,
            headers=headers
        )
        return success

    def test_get_mood_history(self):
        """Test getting mood history"""
        headers = {'Authorization': f'Bearer {self.student_token}'}
        success, response = self.run_test(
            "Get Mood History",
            "GET",
            "mood/history",
            200,
            headers=headers
        )
        return success

    def test_get_resources(self):
        """Test getting resources"""
        success, response = self.run_test(
            "Get Resources",
            "GET",
            "resources",
            200
        )
        return success

def main():
    print("🚀 Starting MindMate API Testing...")
    print("=" * 50)
    
    tester = MindMateAPITester()
    
    # Test Authentication Flow
    print("\n📝 AUTHENTICATION TESTS")
    print("-" * 30)
    
    if not tester.test_student_registration():
        print("❌ Student registration failed, stopping tests")
        return 1
    
    if not tester.test_counsellor_registration():
        print("❌ Counsellor registration failed, stopping tests")
        return 1
    
    if not tester.test_login():
        print("❌ Login failed")
    
    if not tester.test_get_current_user():
        print("❌ Get current user failed")
    
    # Test User Management
    print("\n👥 USER MANAGEMENT TESTS")
    print("-" * 30)
    
    tester.test_search_users()
    tester.test_get_counsellors()
    
    # Test Session Booking (Priority Feature)
    print("\n📅 SESSION BOOKING TESTS (Priority Feature)")
    print("-" * 30)
    
    if not tester.test_create_session():
        print("❌ Session creation failed")
    
    tester.test_get_sessions()
    
    # Test Community Forum (Priority Feature)
    print("\n💬 COMMUNITY FORUM TESTS (Priority Feature)")
    print("-" * 30)
    
    if not tester.test_create_group():
        print("❌ Group creation failed")
    
    tester.test_get_groups()
    tester.test_join_group()
    tester.test_send_message()
    tester.test_get_group_messages()
    tester.test_get_conversations()
    
    # Test Additional Features
    print("\n🧠 ADDITIONAL FEATURES TESTS")
    print("-" * 30)
    
    tester.test_get_quizzes()
    tester.test_record_mood()
    tester.test_get_mood_history()
    tester.test_get_resources()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())