from django.urls import path
from .views import SymptomListView, SymptomLogCreateView, SymptomHistoryView, DiagnosisDetailView
from .chat_views import ChatBotView

urlpatterns = [
    path('list/', SymptomListView.as_view(), name='symptom-list'),
    path('report/', SymptomLogCreateView.as_view(), name='report-symptoms'),
    path('history/', SymptomHistoryView.as_view(), name='symptom-history'),
    path('diagnosis/<int:pk>/', DiagnosisDetailView.as_view(), name='diagnosis-detail'),
    path('chat/', ChatBotView.as_view(), name='chat-bot'),
]