from django.urls import path, include
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from . import views
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# router = routers.DefaultRouter()
# router.register(r'freezes', FreezeTaskViewSet)

urlpatterns = [
    # path('items/', views.Items.as_view()),
    # path('items/<int:pk>', views.ItemDetail.as_view()),

    path('plasmids/', views.Plasmids.as_view()),
    path('plasmids/<int:pk>', views.PlasmidDetail.as_view()),
    
    path('alleles/', views.Alleles.as_view()),
    path('alleles/<int:pk>', views.AlleleDetail.as_view()),
    
    path('strains/', views.Strains.as_view()),
    path('strains/<int:pk>', views.StrainDetail.as_view()),
    
    path('freezes/', FreezeTaskViewSet.as_view({
        'get': 'list',  # List view
        'post': 'create',  # Create view
    }), name='freeze-list'),
    path('freezes/<int:pk>/', FreezeTaskViewSet.as_view({
        'get': 'retrieve',  # Detail view
        'put': 'update',  # Update view
        'patch': 'partial_update',  # Partial update view
        'delete': 'destroy',  # Delete view
    }), name='freeze-detail'),
    # path('model/freezes/<int:pk>/', views.FreezeView.as_view(), name='freeze-detail'),
    #path('', include(router.urls)),

    path('thaws/', ThawTaskViewSet.as_view({
        'get': 'list',  # List view
        'post': 'create',  # Create view
    }), name='thaw-list'),
    path('thaws/<int:pk>/', ThawTaskViewSet.as_view({
        'get': 'retrieve',  # Detail view
        'put': 'update',  # Update view
        'patch': 'partial_update',  # Partial update view
        'delete': 'destroy',  # Delete view
    }), name='thaw-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)