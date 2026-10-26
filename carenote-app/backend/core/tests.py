from django.contrib.auth.models import User
from django.test import TestCase

from .models import AnvandarProfil, skapa_anvandar_profil


class UserProfileSignalTests(TestCase):
    def test_signal_does_not_create_duplicate_profile_for_same_user(self):
        user = User.objects.create_user(username='alice', password='secret123')
        AnvandarProfil.objects.create(user=user)

        skapa_anvandar_profil(User, user, created=True)

        self.assertEqual(AnvandarProfil.objects.filter(user=user).count(), 1)
