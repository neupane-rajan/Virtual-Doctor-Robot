from django.urls import path
from .views import MedicationListCreateView, MedicationDetailView, MedicationLogListCreateView

urlpatterns = [
    path('', MedicationListCreateView.as_view(), name='medication-list-create'),
    path('<int:pk>/', MedicationDetailView.as_view(), name='medication-detail'),
    path('logs/', MedicationLogListCreateView.as_view(), name='medication-log-list-create'),
    
]