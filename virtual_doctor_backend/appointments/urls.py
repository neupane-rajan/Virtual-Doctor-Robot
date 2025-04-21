from django.urls import path
from .views import EmergencyDoctorListView, AppointmentListCreateView, AppointmentDetailView

urlpatterns = [
    path('emergency-doctors/', EmergencyDoctorListView.as_view(), name='emergency-doctor-list'),
    path('', AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
]