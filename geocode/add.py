#!/usr/bin/env python
# -*- coding: utf-8 -*-

from geopy.geocoders import Nominatim

geolocator = Nominatim()
location = geolocator.geocode("5164 RENO ST Philadelphia")

#print(location.address)
print((location.latitude, location.longitude))
#print(location.raw)
