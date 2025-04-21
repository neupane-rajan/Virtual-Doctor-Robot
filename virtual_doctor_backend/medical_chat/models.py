from django.db import models

class MedicalCategory(models.Model):
    name = models.CharField(max_length=100)  # e.g., "knee_pain", "headache", "fever"
    specialty = models.CharField(max_length=100)  # e.g., "orthopedics", "neurology"
    
    def __str__(self):
        return self.name

class MedicalResponse(models.Model):
    category = models.ForeignKey(MedicalCategory, on_delete=models.CASCADE, related_name="responses")
    response_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.category.name} response ({self.id})"

# For tracking conversation history (optional)
class Conversation(models.Model):
    user_identifier = models.CharField(max_length=100)  # Could be session ID
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Conversation {self.id} - {self.created_at}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    is_user = models.BooleanField(default=True)  # True if from user, False if from system
    text = models.TextField()
    category = models.ForeignKey(MedicalCategory, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{'User' if self.is_user else 'Bot'} message in conversation {self.conversation.id}"