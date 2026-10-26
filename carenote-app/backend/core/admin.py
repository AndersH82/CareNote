from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import (
    Brukare, Anteckning, AvvikelseRapport, Lakemedel, MedicinSignering,
    Arbetspass, VikariePass, BrukareAktivitet, ChattMeddelande, Overlamning, AnvandarProfil
)

# 1. Skapa en "inline"-koppling så profilen visas direkt på användarsidan
class AnvandarProfilInline(admin.StackedInline):
    model = AnvandarProfil
    can_delete = False
    verbose_name_plural = 'Användarroll'

# 2. Skapa en anpassad UserAdmin som bakar in profilen
class CustomUserAdmin(UserAdmin):
    inlines = (AnvandarProfilInline,)

# 3. Avregistrera standard-User och registrera vår nya
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# Registrera övriga modeller som vanligt
admin.site.register(Brukare)
admin.site.register(Anteckning)
admin.site.register(AvvikelseRapport)
admin.site.register(Lakemedel)
admin.site.register(MedicinSignering)
admin.site.register(Arbetspass)
admin.site.register(VikariePass)
admin.site.register(BrukareAktivitet)
admin.site.register(ChattMeddelande)
admin.site.register(Overlamning)