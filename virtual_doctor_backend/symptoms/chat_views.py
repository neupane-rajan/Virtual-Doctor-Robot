from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import Symptom, Disease
from .services import SymptomAnalyzer

class ChatBotView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        message = request.data.get('message', '')
        
        # Simple rule-based chatbot for demonstration purposes
        if not message:
            return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Process the message and generate a response
        response = self.process_message(message, request.user)
        return Response({'response': response})
    
    def process_message(self, message, user):
        """
        A simple rule-based message processor
        This would be replaced with a more sophisticated NLP solution in a real application
        """
        message = message.lower()
        
        # Greeting patterns
        if any(greeting in message for greeting in ['hi', 'hello', 'hey', 'greetings']):
            return f"Hello! I'm your Virtual Doctor Bot. How can I help you today?"
        
        # Help pattern
        if any(term in message for term in ['help', 'assist', 'support']):
            return ("I can help you with: \n"
                   "- Analyzing your symptoms\n"
                   "- Managing your medications\n"
                   "- Requesting emergency appointments\n"
                   "What would you like to do?")
        
        # Symptom reporting patterns
        if any(term in message for term in ['feel', 'symptom', 'pain', 'sick', 'ill', 'hurt']):
            return ("I can help analyze your symptoms. Please provide details about how you're feeling. "
                   "You can use our symptom reporting form for a more accurate analysis.")
        
        # Medication patterns
        if any(term in message for term in ['medication', 'medicine', 'drug', 'prescription']):
            return ("I can help you manage your medications. Would you like to:\n"
                   "- View your current medications\n"
                   "- Add a new medication\n"
                   "- Log that you've taken a medication")
        
        # Appointment patterns
        if any(term in message for term in ['appointment', 'doctor', 'emergency', 'visit', 'consultation']):
            return ("I can help you schedule an appointment. Would you like to:\n"
                   "- See a list of available doctors\n"
                   "- Request an emergency appointment\n"
                   "- Check your upcoming appointments")
        
        # Default response
        return ("I'm not sure how to respond to that. I can help with symptom analysis, "
               "medication management, or scheduling appointments. How can I assist you today?")