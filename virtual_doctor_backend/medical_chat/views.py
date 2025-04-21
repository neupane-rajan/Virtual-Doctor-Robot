from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import MedicalCategory, MedicalResponse, Conversation, Message
import json
import re
import random

@csrf_exempt
def chat_endpoint(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_message = data.get('message', '')
        session_id = data.get('session_id', 'default_session')
        
        # Get or create conversation
        conversation, created = Conversation.objects.get_or_create(user_identifier=session_id)
        
        # Save user message
        Message.objects.create(
            conversation=conversation,
            is_user=True,
            text=user_message
        )
        
        # Generate response
        response_data = generate_response(user_message, conversation)
        
        # Remove the category_obj from the response data to avoid serialization issues
        if 'category_obj' in response_data:
            del response_data['category_obj']
            
        # Save bot message - need to get category separately since we removed it from response_data
        category = None
        if 'specialty' in response_data and response_data['specialty']:
            # Try to find category by specialty
            try:
                category = MedicalCategory.objects.filter(specialty=response_data['specialty']).first()
            except:
                pass
                
        Message.objects.create(
            conversation=conversation,
            is_user=False,
            text=response_data['response'],
            category=category
        )
        
        return JsonResponse(response_data)
    
    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

def generate_response(user_message, conversation):
    # Convert to lowercase for easier matching
    message_lower = user_message.lower()
    
    # Basic greeting detection
    greeting_pattern = r'\b(hello|hi|hey|greetings)\b'
    if re.search(greeting_pattern, message_lower):
        greetings = [
            "Hello! I'm your Virtual Doctor assistant. How can I help with your health questions today?",
            "Hi there! I'm here to provide health information and guidance. What health concerns can I address for you?",
            "Welcome! I'm your AI medical assistant. Please let me know what health questions you have today."
        ]
        return {
            'response': random.choice(greetings),
            'specialty': None,
            'isMedical': False
        }
    
    # Medical category matching
    # Define patterns for each category
    patterns = {
        'knee_pain': [r'\b(knee|knees|joint pain|arthritis)\b', r'\b(knee|knees)\b.{0,30}\b(pain|hurt|sore|ache)\b'],
        'headache': [r'\b(headache|migraine|head pain)\b', r'\b(head)\b.{0,20}\b(hurts|pain|ache)\b'],
        'fever': [r'\b(fever|temperature|chills)\b'],
        'cough': [r'\b(cough|coughing|phlegm|mucus)\b'],
        'stomach_pain': [r'\b(stomach|belly|abdomen)\b.{0,30}\b(pain|ache|hurt|upset)\b'],
        'rash': [r'\b(rash|skin|itch|itchy|hives)\b']
    }
    
    # Check for matches
    matched_category = None
    for category_name, category_patterns in patterns.items():
        for pattern in category_patterns:
            if re.search(pattern, message_lower):
                matched_category = category_name
                break
        if matched_category:
            break
    
    # If no specific match found, use general category
    if not matched_category:
        matched_category = 'general'
    
    # Get or create the category
    category_obj, created = MedicalCategory.objects.get_or_create(
        name=matched_category,
        defaults={'specialty': get_specialty_for_category(matched_category)}
    )
    
    # Get responses for this category
    responses = MedicalResponse.objects.filter(category=category_obj)
    
    # If no responses exist yet this will  create them
    if not responses.exists():
        create_default_responses(category_obj)
        responses = MedicalResponse.objects.filter(category=category_obj)
    
    # Choose a random response
    chosen_response = random.choice(responses)
    
    # Return response data without the category_obj
    return {
        'response': chosen_response.response_text,
        'specialty': category_obj.specialty,
        'isMedical': matched_category != 'general'
    }

def get_specialty_for_category(category_name):
    specialty_map = {
        'knee_pain': 'orthopedics',
        'headache': 'neurology',
        'fever': 'general medicine',
        'cough': 'pulmonology',
        'stomach_pain': 'gastroenterology',
        'rash': 'dermatology',
        'general': 'general medicine'
    }
    return specialty_map.get(category_name, 'general medicine')

def create_default_responses(category):
    """Create default responses for a category if none exist."""
    responses = {
        'knee_pain': [
            "Your knee pain could be due to overuse, injury, or conditions like arthritis. Try RICE therapy (Rest, Ice, Compression, Elevation) and over-the-counter pain relievers. If pain persists for more than a week or is severe, consult an orthopedic specialist.",
            "Knee pain is common and often results from strain, minor injury, or wear and tear. For mild cases, try resting, using ice packs for 15-20 minutes several times daily, and taking anti-inflammatory medication like ibuprofen if appropriate for you.",
            "For knee pain, avoid activities that worsen symptoms, consider wearing a compression bandage for support, and elevate your leg when resting. Gentle stretching and strengthening exercises may help once acute pain subsides."
        ],
        'headache': [
            "Your headache could be tension-type (most common), caused by stress or muscle strain. Try OTC pain relievers, stay hydrated, and practice relaxation techniques. If headaches are severe, sudden, or accompanied by other symptoms, seek medical attention.",
            "Headaches can result from many factors including dehydration, eye strain, stress, or lack of sleep. Start with lifestyle modifications and OTC medications. Keep a headache diary to identify triggers.",
            "For recurring headaches, consider environmental factors like bright lights, strong odors, or certain foods. Regular sleep schedules and stress management techniques like meditation may help prevent episodes."
        ],
        'fever': [
            "Fever is your body's natural defense against infection. For adults, rest, stay hydrated, and take acetaminophen or ibuprofen to reduce discomfort. Seek medical attention for fevers above 103°F (39.4°C) or those lasting more than 3 days.",
            "When managing a fever, dress in lightweight clothing, keep room temperature comfortable, and take tepid baths. Drink plenty of fluids to prevent dehydration. Contact a doctor if fever is accompanied by severe headache, rash, or stiff neck."
        ],
        'cough': [
            "For a dry cough, try honey in warm water (if over 1 year old), stay hydrated, and use a humidifier. Cough suppressants may help temporarily. If coughing persists more than 3 weeks or produces thick colored mucus, consult a healthcare provider.",
            "Coughs can be productive (wet) or non-productive (dry). Avoid irritants like smoke, use lozenges to soothe throat irritation, and consider over-the-counter expectorants for productive coughs to help clear mucus."
        ],
        'stomach_pain': [
            "Stomach pain can result from indigestion, gas, or viral infections. Try smaller meals, avoid spicy or fatty foods, and stay hydrated. If pain is severe, persistent, or accompanied by other concerning symptoms, seek medical attention.",
            "For mild stomach discomfort, try peppermint tea, ginger, or over-the-counter antacids. Apply a heating pad on low setting to relieve cramps. Follow the BRAT diet (bananas, rice, applesauce, toast) if experiencing diarrhea."
        ],
        'rash': [
            "For skin rashes, avoid scratching, use mild soap, and apply cool compresses. Try calamine lotion or 1% hydrocortisone cream for itching. If the rash spreads rapidly, blisters, or comes with fever, seek medical attention promptly.",
            "Many rashes resolve on their own within a few days. Keep the affected area clean and dry, avoid tight clothing and excessive heat or humidity. Antihistamines may help if the rash appears to be allergy-related."
        ],
        'general': [
            "Based on your description, I recommend monitoring your symptoms and practicing self-care with adequate rest and hydration. If symptoms worsen or persist beyond a few days, please consult a healthcare provider for proper evaluation.",
            "While I can provide general health information, a proper diagnosis requires a medical professional. Consider tracking your symptoms' frequency and intensity to share with your doctor during consultation.",
            "Your symptoms could have several possible causes. Focus on rest and recovery while monitoring for any changes. If you notice worsening symptoms or development of additional symptoms like fever or severe pain, please seek medical care."
        ]
    }
    
    # Create responses for the given category
    for response_text in responses.get(category.name, responses['general']):
        MedicalResponse.objects.create(
            category=category,
            response_text=response_text
        )