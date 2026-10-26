from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Brukare(models.Model):
    namn = models.CharField(max_length=100)
    personnummer = models.CharField(max_length=13, unique=True)
    kontaktuppgifter = models.TextField(blank=True, null=True)
    genomforandeplan = models.TextField(blank=True, null=True)
    viktig_information = models.TextField(blank=True, null=True)
    anhorig_kontakt = models.TextField(blank=True, null=True)
    skapad_datum = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.namn

class BrukareRutin(models.Model):
    brukare = models.ForeignKey(Brukare, on_delete=models.CASCADE, related_name='rutiner')
    titel = models.CharField(max_length=150) # T.ex. "Morgonhygien kl 08:00"
    beskrivning = models.TextField(blank=True, null=True)
    utford_idag = models.BooleanField(default=False)
    senast_utford_tid = models.DateTimeField(blank=True, null=True)
    utford_av = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        status = "✓ Utförd" if self.utford_idag else "Ej utförd" # Korrigerat till 'if'
        return f"{self.titel} ({self.brukare.namn}) - [{status}]"

# Dagboksanteckningar och avvikelserapporter kopplade till en Brukare

class Anteckning(models.Model):
    MALL_VAL = [
        ('vardag', 'Vardaglig händelse'),
        ('omvårdnad', 'Omvårdnad & Hygien'),
        ('kost', 'Kost & Måltid'),
        ('aktivitet', 'Aktivitet & Utevistelse'),
    ]
    
    brukare = models.ForeignKey(Brukare, on_delete=models.CASCADE, related_name='anteckningar')
    personal_namn = models.CharField(max_length=100) # Vem som skrev
    mall = models.CharField(max_length=20, choices=MALL_VAL, default='vardag')
    text = models.TextField()
    skapad_datum = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.skapad_datum.strftime('%Y-%m-%d %H:%M')} - {self.brukare.namn} ({self.mall})"


class AvvikelseRapport(models.Model):
    ALLVARLIGHET = [
        ('lag', 'Låg'),
        ('medel', 'Medel'),
        ('hog', 'Hög'),
    ]

    brukare = models.ForeignKey(Brukare, on_delete=models.CASCADE, related_name='avvikelser')
    personal_namn = models.CharField(max_length=100)
    rubrik = models.CharField(max_length=150)
    beskrivning = models.TextField()
    allvarlighetsgrad = models.CharField(max_length=10, choices=ALLVARLIGHET, default='lag')
    skapad_datum = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AVVIKELSE: {self.rubrik} ({self.brukare.namn})"

# Läkemedel och medicinsigneringar kopplade till en Brukare

class Lakemedel(models.Model):
    brukare = models.ForeignKey(Brukare, on_delete=models.CASCADE, related_name='lakemedel')
    namn = models.CharField(max_length=150) # T.ex. "Alvedon 500mg"
    dosering = models.CharField(max_length=100) # T.ex. "1 tablett"
    tider = models.CharField(max_length=100) # T.ex. "Morgon, Kväll"
    aktiv = models.BooleanField(default=True)
    skapad_datum = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.namn} ({self.dosering}) - {self.brukare.namn}"


class MedicinSignering(models.Model):
    lakemedel = models.ForeignKey(Lakemedel, on_delete=models.CASCADE, related_name='signeringar')
    personal_namn = models.CharField(max_length=100)
    signerad_tid = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='Givet') # Givet / Missat / Avböjt

    def __str__(self):
        return f"Signerat: {self.lakemedel.namn} av {self.personal_namn} ({self.signerad_tid.strftime('%Y-%m-%d %H:%M')})"

# Arbetspass och vikariehantering

class Arbetspass(models.Model):
    PASS_TYPER = [
    ('dag', 'Dagpass'),
    ('kväll', 'Kvällspass'),
    ('natt', 'Nattpass'),
]
    personal_namn = models.CharField(max_length=100)
    datum = models.DateField()
    typ = models.CharField(max_length=20, choices=PASS_TYPER, default='dag')
    start_tid = models.TimeField(default='07:00')
    sluttid = models.TimeField(default='15:30')
    bekräftad = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.datum} ({self.typ}) - {self.personal_namn}"


class VikariePass(models.Model):
    arbetspass = models.OneToOneField(Arbetspass, on_delete=models.CASCADE, related_name='vikarie_ansok')
    ledig_for_bokning = models.BooleanField(default=True)
    anteckning = models.TextField(blank=True, null=True)

    def __str__(self):
        status = "Ledigt för vikarie" if self.ledig_for_bokning else "Bokat"
        return f"Vikariebehov: {self.arbetspass} [{status}]"


class BrukareAktivitet(models.Model):
    brukare = models.ForeignKey(Brukare, on_delete=models.CASCADE, related_name='aktiviteter')
    titel = models.CharField(max_length=150) # T.ex. "Sjukgymnastik" eller "Promenad"
    datum = models.DateField()
    tid = models.TimeField()
    beskrivning = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.datum} {self.tid} - {self.titel} ({self.brukare.namn})"

class BrukareKalenderHändelse(models.Model):
    brukare = models.ForeignKey(Brukare, on_delete=models.CASCADE, related_name='kalender_handelser')
    titel = models.CharField(max_length=150) # T.ex. "Läkarmöte Vårdcentralen"
    datum = models.DateField()
    tid = models.TimeField(blank=True, null=True)
    plats = models.CharField(max_length=150, blank=True, null=True)
    beskrivning = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.datum} - {self.titel} ({self.brukare.namn})"

# Chattmeddelanden och överlämningar mellan personal

class ChattMeddelande(models.Model):
    AVDELNING_VAL = [
        ('alla', 'Hela arbetsgruppen'),
        ('dag', 'Dagpersonal'),
        ('kvall', 'Kvällspersonal'),
        ('natt', 'Nattpersonal'),
    ]
    
    avsandare = models.CharField(max_length=100)
    mottagargrupp = models.CharField(max_length=20, choices=AVDELNING_VAL, default='alla')
    meddelande = models.TextField()
    skapad_datum = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.get_mottagargrupp_display()}] {self.avsandare}: {self.meddelande[:30]}..."


class Overlamning(models.Model):
    PASS_VAL = [
        ('dag_till_kvall', 'Dag till Kväll'),
        ('kvall_till_natt', 'Kväll till Natt'),
        ('natt_till_dag', 'Natt till Dag'),
    ]
    
    skapad_av = models.CharField(max_length=100)
    skiftbyte = models.CharField(max_length=30, choices=PASS_VAL, default='dag_till_kvall')
    sammanfattning = models.TextField() # Viktigt som har hänt under passet
    aktuella_fragor = models.TextField(blank=True, null=True) # Vad nästa pass måste tänka på
    datum = models.DateField(auto_now_add=True)
    skapad_tid = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Överlämning ({self.get_skiftbyte_display()}) - {self.datum}"

# Användarprofiler och roller

class AnvandarProfil(models.Model):
    ROLLER = [
        ('personal', 'Personal'),
        ('samordnare', 'Samordnare'),
        ('chef', 'Chef'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profil')
    roll = models.CharField(max_length=20, choices=ROLLER, default='personal')

    def __str__(self):
        return f"{self.user.username} ({self.roll})"

# Automatiskt skapa en profil när en ny användare registreras
#@receiver(post_save, sender=User)
#def skapa_anvandar_profil(sender, instance, created, **kwargs):
#    if created:
#        AnvandarProfil.objects.create(user=instance)