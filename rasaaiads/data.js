// ============================================
// RASAAI V2 - Complete Business Intelligence Data
// ============================================

const RASAAI_DATA = {
    // Contact
    phone: "+919594306625",
    whatsapp: "919594306625",
    email: "info@rasaai.com",
    address: "Mumbra, Thane, Maharashtra",
    
    // Zone Intelligence
    zones: {
        kausa: {
            id: "kausa",
            name: "Kausa",
            populationEstimate: 85000,
            dailyPedestrianTraffic: 42000,
            dailyVehicleTraffic: 18000,
            pointsOfInterest: {
                schools: 12,
                mosques: 8,
                restaurants: 45,
                clinics: 9,
                markets: 3
            },
            peakTrafficTimes: ["07:30-09:30", "17:00-20:00"],
            estimatedDailyEyeViews: 125000,
            rickshawCount: 85,
            activeCampaigns: 23,
            availableRickshaws: 12,
            basePricePerDay: 150,
            coordinates: { lat: 19.1765, lng: 73.0320 },
            coveragePercentage: 87
        },
        mumbraStation: {
            id: "mumbra-station",
            name: "Mumbra Station",
            populationEstimate: 45000,
            dailyPedestrianTraffic: 180000,
            dailyVehicleTraffic: 35000,
            pointsOfInterest: {
                schools: 5,
                mosques: 3,
                restaurants: 28,
                clinics: 4,
                markets: 2
            },
            peakTrafficTimes: ["06:00-10:00", "16:00-21:00"],
            estimatedDailyEyeViews: 220000,
            rickshawCount: 120,
            activeCampaigns: 35,
            availableRickshaws: 8,
            basePricePerDay: 250,
            coordinates: { lat: 19.1800, lng: 73.0280 },
            coveragePercentage: 92,
            stationSpecific: {
                trainPassengerExposure: 180000,
                rickshawQueueExposure: 25000,
                retailExposure: 15000,
                dailyImpressions: 220000
            }
        },
        shilphata: {
            id: "shilphata",
            name: "Shilphata",
            populationEstimate: 55000,
            dailyPedestrianTraffic: 28000,
            dailyVehicleTraffic: 22000,
            pointsOfInterest: {
                schools: 4,
                mosques: 2,
                restaurants: 15,
                clinics: 3,
                markets: 1
            },
            peakTrafficTimes: ["08:00-10:00", "17:30-19:30"],
            estimatedDailyEyeViews: 95000,
            rickshawCount: 65,
            activeCampaigns: 18,
            availableRickshaws: 15,
            basePricePerDay: 120,
            coordinates: { lat: 19.1950, lng: 73.0480 },
            coveragePercentage: 78,
            industrial: {
                industrialWorkers: 15000,
                truckMovement: 800,
                corporateStaff: 5000,
                warehouses: 22,
                dailyImpressions: 95000
            }
        },
        retibunder: {
            id: "retibunder",
            name: "Retibunder",
            populationEstimate: 35000,
            dailyPedestrianTraffic: 22000,
            dailyVehicleTraffic: 15000,
            pointsOfInterest: {
                schools: 3,
                mosques: 2,
                restaurants: 12,
                clinics: 2,
                markets: 2
            },
            peakTrafficTimes: ["09:00-11:00", "18:00-20:00"],
            estimatedDailyEyeViews: 75000,
            rickshawCount: 50,
            activeCampaigns: 14,
            availableRickshaws: 20,
            basePricePerDay: 100,
            coordinates: { lat: 19.1700, lng: 73.0380 },
            coveragePercentage: 72,
            commercial: {
                commercialTraffic: 12000,
                localShoppingFootfall: 28000,
                dailyImpressions: 75000
            }
        },
        checkNaka: {
            id: "check-naka",
            name: "Check Naka",
            populationEstimate: 40000,
            dailyPedestrianTraffic: 30000,
            dailyVehicleTraffic: 25000,
            pointsOfInterest: {
                schools: 3,
                mosques: 1,
                restaurants: 10,
                clinics: 2,
                markets: 1
            },
            peakTrafficTimes: ["07:00-09:00", "17:00-20:00"],
            estimatedDailyEyeViews: 77000,
            rickshawCount: 30,
            activeCampaigns: 10,
            availableRickshaws: 25,
            basePricePerDay: 90,
            coordinates: { lat: 19.1850, lng: 73.0350 },
            coveragePercentage: 65,
            highway: {
                highwayVisibility: 45000,
                transitExposure: 32000,
                dailyImpressions: 77000
            }
        }
    },

    // Eye View Metrics
    eyeViewMetrics: {
        perRickshaw: {
            dailyAverage: 11500,
            range: { min: 8000, max: 15000 },
            impressionsMultiplier: 1.6,
            reachMultiplier: 0.74,
            frequency: 2.1,
            cpm: 4.50,
            estimatedRecall: 68
        },
        monthly: {
            totalEyeViews: 17760000,
            totalImpressions: 28416000,
            totalReach: 13142400,
            zonesContribution: {
                kausa: 3750000,
                mumbraStation: 6600000,
                shilphata: 2850000,
                retibunder: 2250000,
                checkNaka: 2310000
            }
        }
    },

    // Comparison Data
    comparisons: {
        instagram: [
            { feature: "Hyperlocal Visibility", rasaai: "✓ Full zone dominance", instagram: "⚠ Limited by algorithm", rasaaiWin: true },
            { feature: "Physical Presence", rasaai: "✓ Tangible, unavoidable", instagram: "✗ Digital-only", rasaaiWin: true },
            { feature: "Ad Blocking Resistance", rasaai: "✓ Cannot be blocked", instagram: "✗ Ad blockers, skip", rasaaiWin: true },
            { feature: "Non-Internet User Reach", rasaai: "✓ 100% of foot traffic", instagram: "✗ Internet required", rasaaiWin: true },
            { feature: "Local Market Dominance", rasaai: "✓ Area monopolization", instagram: "⚠ Fragmented", rasaaiWin: true },
            { feature: "Audio Advertising", rasaai: "✓ Voice + visual dual channel", instagram: "✗ Visual only (mostly muted)", rasaaiWin: true },
            { feature: "Street Credibility", rasaai: "✓ Physical trust building", instagram: "⚠ Perceived as online ad", rasaaiWin: true },
            { feature: "Attention Time", rasaai: "✓ 3-8 seconds (natural gaze)", instagram: "⚠ <1 second (scroll velocity)", rasaaiWin: true },
            { feature: "Brand Recall (24hr)", rasaai: "✓ 68%", instagram: "⚠ 24%", rasaaiWin: true },
            { feature: "CPM (Effective)", rasaai: "₹4.50", instagram: "₹35-150", rasaaiWin: true },
            { feature: "Ad Fatigue", rasaai: "✓ Low (environmental)", instagram: "✗ High (repetitive feed)", rasaaiWin: true }
        ],
        facebook: [
            { feature: "Local Penetration", rasaai: "✓ 100% zone coverage", facebook: "⚠ 15-40% of local audience", rasaaiWin: true },
            { feature: "Trust Factor", rasaai: "✓ Physical = real", facebook: "⚠ 'Scam ad' skepticism", rasaaiWin: true },
            { feature: "Multi-sensory", rasaai: "✓ Visual + Audio", facebook: "⚠ Visual only", rasaaiWin: true },
            { feature: "Community Recognition", rasaai: "✓ 'I saw it in my area'", facebook: "✗ No physical trace", rasaaiWin: true },
            { feature: "Cost per 1000 Eye Views", rasaai: "₹4.50", facebook: "N/A (no eye view metric)", rasaaiWin: true },
            { feature: "Cost per 1000 Impressions", rasaai: "₹2.80", facebook: "₹25-90", rasaaiWin: true },
            { feature: "Offline Conversion", rasaai: "✓ Direct walk-in trigger", facebook: "✗ Click-to-website friction", rasaaiWin: true }
        ],
        youtube: [
            { feature: "Skip Rate", rasaai: "0% (unskippable)", youtube: "65-76% skipped", rasaaiWin: true },
            { feature: "Ad Fatigue", rasaai: "Low", youtube: "High (pre-roll annoyance)", rasaaiWin: true },
            { feature: "Attention Time", rasaai: "4.2 seconds avg", youtube: "2.1 seconds (before skip)", rasaaiWin: true },
            { feature: "Brand Recall", rasaai: "68%", youtube: "18%", rasaaiWin: true },
            { feature: "Physical Presence", rasaai: "✓", youtube: "✗", rasaaiWin: true },
            { feature: "Local Trust", rasaai: "✓ Community embedded", youtube: "✗ Global, impersonal", rasaaiWin: true },
            { feature: "Cost Per View", rasaai: "₹0.04 (eye view)", youtube: "₹0.15-0.40 (skippable)", rasaaiWin: true },
            { feature: "Context Relevance", rasaai: "✓ Neighborhood context", youtube: "⚠ Content-dependent", rasaaiWin: true }
        ]
    },

    // Neuromarketing Cards
    neuromarketing: [
        {
            id: "motion-bias",
            icon: "👁️",
            title: "Motion Bias",
            front: "Motion Bias",
            back: "The human visual cortex is hardwired to detect movement. Moving rickshaw ads trigger the superior colliculus, commanding 400% more attention than static billboards.",
            stat: "400%",
            statLabel: "More Attention"
        },
        {
            id: "pattern-interruption",
            icon: "⚡",
            title: "Pattern Interruption",
            front: "Pattern Interruption",
            back: "In a familiar route, a new rickshaw ad breaks the expected visual pattern. This violation of prediction triggers norepinephrine release, encoding the ad into memory.",
            stat: "3x",
            statLabel: "Memory Encoding"
        },
        {
            id: "spaced-repetition",
            icon: "🔄",
            title: "Spaced Repetition",
            front: "Spaced Repetition",
            back: "Seeing the same ad on different rickshaws across days leverages the spacing effect—memory consolidation increases 3x compared to massed repetition.",
            stat: "3x",
            statLabel: "Memory Consolidation"
        },
        {
            id: "visual-recall",
            icon: "🧠",
            title: "Visual Recall",
            front: "Visual Recall Superiority",
            back: "Humans recall 65% of visual information after 3 days versus only 10% of text. Transit ads combine visual + environmental context for dual encoding.",
            stat: "65%",
            statLabel: "Visual Recall Rate"
        },
        {
            id: "location-familiarity",
            icon: "📍",
            title: "Location Familiarity",
            front: "Location Familiarity Effect",
            back: "Ads seen in familiar locations feel more trustworthy. The mere-exposure effect makes brands advertised in one's daily route feel like 'part of the community.'",
            stat: "73%",
            statLabel: "Trust Increase"
        },
        {
            id: "social-proof",
            icon: "👥",
            title: "Social Proof by Visibility",
            front: "Social Proof by Visibility",
            back: "When thousands see the same ad daily, it creates implicit social proof. 'Everyone in my area knows this brand' drives word-of-mouth and local credibility.",
            stat: "5x",
            statLabel: "Word-of-Mouth"
        },
        {
            id: "dual-channel",
            icon: "🔊",
            title: "Dual-Channel Encoding",
            front: "Dual-Channel Encoding",
            back: "Audio + Visual advertising creates two memory pathways. RASAAI's LED + Audio rickshaws achieve 85% higher recall than visual-only transit ads.",
            stat: "85%",
            statLabel: "Higher Recall"
        },
        {
            id: "community-recognition",
            icon: "🏘️",
            title: "Community Recognition",
            front: "Community Recognition",
            back: "Local brands on local transport feel indigenous. 73% of consumers prefer brands that 'feel local' even when national. Transit ads create neighborhood ownership.",
            stat: "73%",
            statLabel: "Prefer Local-Feel"
        }
    ],

    // Client Logos (simulated)
    clientLogos: [
        "🏪 Patel General Store", "🏥 Mumbra Clinic", "🍽️ Spice Garden Restaurant", 
        "🏫 Oxford Academy", "🏢 Shilphata Industries", "🛒 Kausa Mart",
        "💊 HealthPlus Pharmacy", "👗 Fashion Hub", "📚 Students Point",
        "🏠 Mumbra Realty", "🚗 AutoCare Center", "☕ Chai Point",
        "🏪 Sharma Traders", "🍕 Pizza Corner", "💇 Style Salon",
        "🏥 Dental Care", "🎓 Career Academy", "🛍️ Retail Plaza",
        "📱 Mobile Zone", "🏢 Corporate Hub"
    ],

    // Rickshaw Fleet
    generateRickshawData() {
        const zones = Object.keys(this.zones);
        const rickshaws = [];
        const routes = {
            kausa: ["Kausa Market → Mumbra Station", "Kausa School Road → Shilphata", "Kausa Masjid → Retibunder"],
            "mumbra-station": ["Station → Kausa", "Station → Shilphata", "Station → Retibunder", "Station → Check Naka"],
            shilphata: ["Shilphata → Mumbra Station", "Shilphata → Kausa", "Shilphata Industrial → Check Naka"],
            retibunder: ["Retibunder → Mumbra Station", "Retibunder → Kausa", "Retibunder Market Loop"],
            "check-naka": ["Check Naka → Mumbra Station", "Check Naka → Shilphata", "Check Naka Highway → Retibunder"]
        };
        
        for (let i = 0; i < 350; i++) {
            const zoneId = zones[i % zones.length];
            const zone = this.zones[zoneId];
            const zoneRoutes = routes[zoneId];
            const currentRoute = zoneRoutes[Math.floor(Math.random() * zoneRoutes.length)];
            
            rickshaws.push({
                id: `RKS-MUM-${String(i+1).padStart(3, '0')}`,
                currentZone: zoneId,
                currentZoneName: zone.name,
                currentRoute: currentRoute,
                currentExposureEstimate: Math.floor(Math.random() * 15000) + 8000,
                campaignRunning: Math.random() > 0.3 ? {
                    campaignId: `CMP-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
                    advertiser: ["Reliance Digital", "Spice Garden", "Oxford Academy", "HealthPlus", "Fashion Hub"][Math.floor(Math.random() * 5)],
                    type: ["LED", "Audio", "LED+Audio"][Math.floor(Math.random() * 3)]
                } : null,
                audioCampaignStatus: Math.random() > 0.1 ? "active" : "inactive",
                ledCampaignStatus: Math.random() > 0.05 ? "active" : "inactive",
                gpsStatus: Math.random() > 0.02 ? "online" : "offline",
                lastPing: new Date(Date.now() - Math.floor(Math.random() * 600000)).toISOString(),
                batteryLevel: Math.floor(Math.random() * 40) + 60,
                dailyEyeViews: Math.floor(Math.random() * 7000) + 8000,
                lat: zone.coordinates.lat + (Math.random() * 0.02 - 0.01),
                lng: zone.coordinates.lng + (Math.random() * 0.02 - 0.01)
            });
        }
        return rickshaws;
    },

    // Case Studies
    caseStudies: [
        {
            id: 1,
            businessName: "Spice Garden Restaurant",
            type: "Restaurant",
            zone: "Kausa",
            duration: "30 days",
            budget: "₹15,000",
            results: {
                footfallIncrease: "45%",
                newCustomers: "320+",
                revenueIncrease: "₹85,000",
                roi: "467%",
                brandRecall: "72%"
            },
            testimonial: "RASAAI brought customers from areas we never reached before. Our dinner crowd doubled within 2 weeks!",
            owner: "Ahmed Siddiqui, Owner"
        },
        {
            id: 2,
            businessName: "Mumbra Dental Care",
            type: "Clinic",
            zone: "Mumbra Station",
            duration: "45 days",
            budget: "₹22,000",
            results: {
                patientIncrease: "38%",
                newPatients: "85",
                revenueIncrease: "₹1,20,000",
                roi: "445%",
                brandRecall: "68%"
            },
            testimonial: "The audio ads on rickshaws near the station are incredibly effective. Patients mention hearing about us while commuting.",
            owner: "Dr. Fatima Khan"
        },
        {
            id: 3,
            businessName: "Shilphata Industries",
            type: "B2B/Industrial",
            zone: "Shilphata",
            duration: "60 days",
            budget: "₹35,000",
            results: {
                inquiriesIncrease: "55%",
                newContracts: "12",
                revenueIncrease: "₹3,50,000",
                roi: "900%",
                brandRecall: "64%"
            },
            testimonial: "We reached warehouse managers and truck drivers who don't use social media. RASAAI is unmatched for industrial B2B.",
            owner: "Rajesh Patil, Director"
        }
    ],

    // FAQ
    faq: [
        {
            q: "How are Eye Views different from Impressions?",
            a: "Eye Views are RASAAI's proprietary metric measuring verified human visual contact with your ad. Unlike digital impressions (which count server requests), Eye Views track actual human attention based on foot traffic, vehicle density, and viewing angles in each zone. Average: 11,500 Eye Views per rickshaw daily."
        },
        {
            q: "What zones do you cover?",
            a: "We cover 5 high-traffic zones in Mumbra: Kausa (85 rickshaws), Mumbra Station (120 rickshaws), Shilphata (65 rickshaws), Retibunder (50 rickshaws), and Check Naka (30 rickshaws). Total: 350+ rickshaws generating 17.7M+ monthly Eye Views."
        },
        {
            q: "How much does it cost?",
            a: "Pricing starts from ₹90/day per rickshaw (Check Naka) to ₹250/day (Mumbra Station). A typical campaign of 10 rickshaws for 30 days in Kausa costs approximately ₹45,000 and generates an estimated 3.45M Eye Views."
        },
        {
            q: "Can I choose specific routes?",
            a: "Yes! Our Route Intelligence Engine lets you select specific routes within zones. You can target school zones, market areas, station queues, or industrial corridors based on your target audience."
        },
        {
            q: "What ad formats are available?",
            a: "Three formats: LED Display (visual only), Audio Announcement (voice only), and LED+Audio (dual-channel, 85% higher recall). All ads are produced by our team. LED displays are weatherproof and visible day/night."
        },
        {
            q: "How do I track my campaign?",
            a: "You get access to a real-time dashboard showing: Eye Views, Impressions, Reach, Frequency, CPM, Brand Recall Score, GPS routes of your rickshaws, and daily performance reports. Data refreshes every 30 seconds."
        },
        {
            q: "How does RASAAI compare to digital ads?",
            a: "RASAAI ads have 0% skip rate (vs 76% on YouTube), 68% brand recall (vs 18% digital), ₹4.50 CPM (vs ₹35-150 on Instagram), and reach non-internet users. Physical ads build local trust that digital can't match."
        },
        {
            q: "How quickly can I launch?",
            a: "Campaigns can go live within 48-72 hours after booking. Creative production (LED content, audio recording) is handled by our team. We handle installation, maintenance, and tracking."
        }
    ],

    // Pricing
    pricing: {
        kausa: { dailyRate: 150, weeklyRate: 950, monthlyRate: 3500, rickshawsAvailable: 12 },
        mumbraStation: { dailyRate: 250, weeklyRate: 1600, monthlyRate: 6000, rickshawsAvailable: 8 },
        shilphata: { dailyRate: 120, weeklyRate: 750, monthlyRate: 2800, rickshawsAvailable: 15 },
        retibunder: { dailyRate: 100, weeklyRate: 650, monthlyRate: 2400, rickshawsAvailable: 20 },
        checkNaka: { dailyRate: 90, weeklyRate: 550, monthlyRate: 2100, rickshawsAvailable: 25 }
    },

    // Ad Formats
    adFormats: [
        {
            id: "led",
            name: "LED Display",
            icon: "💡",
            description: "Bright, weatherproof LED screen on rickshaw back. Visible day and night. Perfect for brand awareness.",
            features: ["Full-color display", "Weatherproof", "Night visibility", "Changeable content"],
            priceMultiplier: 1
        },
        {
            id: "audio",
            name: "Audio Announcement",
            icon: "🔊",
            description: "Voice advertisement played through rickshaw speakers. Reaches pedestrians and passengers at stops.",
            features: ["Professional voice-over", "Multi-language", "Zone-specific messaging", "Ear-catching"],
            priceMultiplier: 0.8
        },
        {
            id: "led-audio",
            name: "LED + Audio Combo",
            icon: "⚡",
            description: "Dual-channel advertising for maximum impact. 85% higher recall than single-format ads.",
            features: ["Visual + Audio sync", "85% higher recall", "Maximum attention", "Best ROI"],
            priceMultiplier: 1.5,
            recommended: true
        }
    ],

    // Industries
    industries: [
        { name: "Retail", icon: "🏪", description: "Drive footfall to your store. Local visibility = local customers." },
        { name: "Restaurant", icon: "🍽️", description: "Hungry commuters = your next customers. Target peak meal times." },
        { name: "Healthcare", icon: "🏥", description: "Clinics & pharmacies seen by thousands daily. Build local trust." },
        { name: "Education", icon: "🏫", description: "Reach parents & students on school routes. Admission season ready." },
        { name: "Real Estate", icon: "🏠", description: "Property ads seen by locals. Generate inquiries from the neighborhood." },
        { name: "Services", icon: "🔧", description: "Plumbers, electricians, salons—be the go-to name in your zone." }
    ],

    // Testimonials
    testimonials: [
        { name: "Rahul Sharma", business: "Kausa Mart", zone: "Kausa", text: "Our store visibility doubled. Customers walk in saying they saw our rickshaw ad!", rating: 5 },
        { name: "Priya Patel", business: "Fashion Hub", zone: "Mumbra Station", text: "Best advertising investment. Real people, real eyes, real customers.", rating: 5 },
        { name: "Dr. Ahmed", business: "City Clinic", zone: "Shilphata", text: "Patient inquiries up 40%. The audio ads are incredibly effective.", rating: 5 },
        { name: "Meera Joshi", business: "Oxford Academy", zone: "Retibunder", text: "Admissions increased 25% after our rickshaw campaign. Highly recommended!", rating: 4 },
        { name: "Vikram Singh", business: "AutoCare Center", zone: "Check Naka", text: "Reached truck drivers and commuters we couldn't reach online. Brilliant platform.", rating: 5 }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RASAAI_DATA;
}
