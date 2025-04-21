from django.contrib import admin
from .models import MedicalCategory, MedicalResponse, Conversation, Message

class MedicalResponseInline(admin.TabularInline):
    model = MedicalResponse
    extra = 1

@admin.register(MedicalCategory)
class MedicalCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialty', 'response_count')
    search_fields = ('name', 'specialty')
    inlines = [MedicalResponseInline]
    
    def response_count(self, obj):
        return obj.responses.count()
    response_count.short_description = 'Number of Responses'

@admin.register(MedicalResponse)
class MedicalResponseAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'response_preview', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('response_text',)
    
    def response_preview(self, obj):
        return obj.response_text[:50] + '...' if len(obj.response_text) > 50 else obj.response_text
    response_preview.short_description = 'Response Preview'

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_identifier', 'created_at', 'message_count')
    search_fields = ('user_identifier',)
    
    def message_count(self, obj):
        return obj.messages.count()
    message_count.short_description = 'Number of Messages'

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation', 'is_user', 'text_preview', 'category', 'timestamp')
    list_filter = ('is_user', 'timestamp', 'category')
    search_fields = ('text',)
    
    def text_preview(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Message Preview'