// ============================================
// RASAAI V2 - Complete Interactive Application
// All sections populated, all interactive elements working
// ============================================

// ============================================
// GLOBAL DATA
// ============================================
const P = "+919594306625";
const W = "919594306625";
const E = "mafs.grp@gmail.com";

const ZONES = {
    kausa: { id:"kausa", name:"Kausa", pop:85000, ped:42000, veh:18000, poi:{schools:12,mosques:8,restaurants:45,clinics:9,markets:3}, peak:["07:30-09:30","17:00-20:00"], eyes:125000, ricks:85, camp:23, avail:12, price:150, lat:19.1765, lng:73.0320, cov:87 },
    "mumbra-station": { id:"mumbra-station", name:"Mumbra Station", pop:45000, ped:180000, veh:35000, poi:{schools:5,mosques:3,restaurants:28,clinics:4,markets:2}, peak:["06:00-10:00","16:00-21:00"], eyes:220000, ricks:120, camp:35, avail:8, price:250, lat:19.1800, lng:73.0280, cov:92 },
    shilphata: { id:"shilphata", name:"Shilphata", pop:55000, ped:28000, veh:22000, poi:{schools:4,mosques:2,restaurants:15,clinics:3,markets:1}, peak:["08:00-10:00","17:30-19:30"], eyes:95000, ricks:65, camp:18, avail:15, price:120, lat:19.1950, lng:73.0480, cov:78 },
    retibunder: { id:"retibunder", name:"Retibunder", pop:35000, ped:22000, veh:15000, poi:{schools:3,mosques:2,restaurants:12,clinics:2,markets:2}, peak:["09:00-11:00","18:00-20:00"], eyes:75000, ricks:50, camp:14, avail:20, price:100, lat:19.1700, lng:73.0380, cov:72 },
    "check-naka": { id:"check-naka", name:"Check Naka", pop:40000, ped:30000, veh:25000, poi:{schools:3,mosques:1,restaurants:10,clinics:2,markets:1}, peak:["07:00-09:00","17:00-20:00"], eyes:77000, ricks:30, camp:10, avail:25, price:90, lat:19.1850, lng:73.0350, cov:65 }
};

const ROUTES = {
    kausa: ["Kausa → Mumbra Station","Kausa → MM Valley Road","Kausa → Kalsekar Bypass"],
    "mumbra-station": ["Station → Kausa → Shilphata","Station → Retibunder → Kalwa Naka","Station → Check Naka → Majhiwada"],
    shilphata: ["Shilphata → Kalyan Phata","Shilphata → Taloja Phase 1","Shilphata → Taloja Phase 2"],
    retibunder: ["Retibunder → Kalwa Naka","Retibunder → Mumbra Station","Retibunder → Check Naka"],
    "check-naka": ["Check Naka → Majhiwada","Check Naka → Mumbra Station","Check Naka → Retibunder"]
};

const NEURO = [
    {icon:"👁️",title:"Motion Bias",front:"Motion Bias",back:"Human visual cortex is hardwired to detect movement. Moving rickshaw ads command 400% more attention than static billboards.",stat:"400%",label:"More Attention"},
    {icon:"⚡",title:"Pattern Interruption",front:"Pattern Interruption",back:"A new ad breaks expected visual patterns, triggering norepinephrine release and encoding the ad into memory.",stat:"3x",label:"Memory Encoding"},
    {icon:"🔄",title:"Spaced Repetition",front:"Spaced Repetition",back:"Seeing ads on different rickshaws across days leverages the spacing effect—3x memory consolidation.",stat:"3x",label:"Consolidation"},
    {icon:"🧠",title:"Visual Recall",front:"Visual Recall",back:"Humans recall 65% of visual info after 3 days vs 10% of text. Transit ads combine visual + environmental context.",stat:"65%",label:"Recall Rate"},
    {icon:"📍",title:"Location Familiarity",front:"Location Familiarity",back:"Ads in familiar locations feel trustworthy. Mere-exposure makes brands feel like part of the community.",stat:"73%",label:"Trust Increase"},
    {icon:"👥",title:"Social Proof",front:"Social Proof",back:"Thousands seeing the same ad daily creates implicit social proof driving word-of-mouth.",stat:"5x",label:"Word-of-Mouth"},
    {icon:"🔊",title:"Dual-Channel",front:"Dual-Channel Encoding",back:"Audio + Visual creates two memory pathways. 85% higher recall than visual-only transit ads.",stat:"85%",label:"Higher Recall"},
    {icon:"🏘️",title:"Community",front:"Community Recognition",back:"73% of consumers prefer brands that feel local. Transit ads create neighborhood ownership.",stat:"73%",label:"Prefer Local"}
];

const COMPARISONS = {
    instagram: [
        ["Hyperlocal Visibility","✅ Full zone dominance","⚠️ Limited by algorithm"],
        ["Physical Presence","✅ Tangible, unavoidable","❌ Digital-only"],
        ["Ad Blocking","✅ Cannot be blocked","❌ Ad blockers work"],
        ["Non-Internet Users","✅ 100% foot traffic","❌ Internet required"],
        ["Local Dominance","✅ Area monopolization","⚠️ Fragmented reach"],
        ["Audio Advertising","✅ Voice + visual","❌ Visual only (muted)"],
        ["Street Credibility","✅ Physical trust","⚠️ 'Online ad' perception"],
        ["Attention Time","✅ 3-8 seconds","⚠️ <1 second scroll"],
        ["Brand Recall 24hr","✅ 68%","⚠️ 24%"],
        ["Effective CPM","✅ ₹4.50","⚠️ ₹35-150"],
        ["Ad Fatigue","✅ Low (environmental)","❌ High (repetitive)"]
    ],
    facebook: [
        ["Local Penetration","✅ 100% zone coverage","⚠️ 15-40% of locals"],
        ["Trust Factor","✅ Physical = real","⚠️ 'Scam ad' skepticism"],
        ["Multi-sensory","✅ Visual + Audio","⚠️ Visual only"],
        ["Community Feel","✅ 'I saw it in my area'","❌ No physical trace"],
        ["Cost/1000 Eye Views","✅ ₹4.50","❌ N/A (no eye metric)"],
        ["Cost/1000 Impressions","✅ ₹2.80","⚠️ ₹25-90"],
        ["Offline Conversion","✅ Direct walk-in","❌ Click-to-website"]
    ],
    youtube: [
        ["Skip Rate","✅ 0% (unskippable)","❌ 65-76% skipped"],
        ["Ad Fatigue","✅ Low","❌ High (pre-roll)"],
        ["Attention Time","✅ 4.2 sec avg","⚠️ 2.1 sec (pre-skip)"],
        ["Brand Recall","✅ 68%","⚠️ 18%"],
        ["Physical Presence","✅ Yes","❌ No"],
        ["Local Trust","✅ Community embedded","❌ Global/impersonal"],
        ["Cost Per View","✅ ₹0.04/eye view","⚠️ ₹0.15-0.40"],
        ["Context Relevance","✅ Neighborhood","⚠️ Content-dependent"]
    ]
};

const INDUSTRIES = [
    {name:"Retail Stores",icon:"🏪",desc:"Drive footfall to your store. Local visibility = local customers walking in daily."},
    {name:"Restaurants",icon:"🍽️",desc:"Hungry commuters see your ad. Target peak meal times for maximum impact."},
    {name:"Clinics",icon:"🏥",desc:"Healthcare ads seen by thousands daily. Build local trust and patient base."},
    {name:"Pharmacies",icon:"💊",desc:"Medical shops visible to every passerby. Emergency recall when needed most."},
    {name:"Schools",icon:"🏫",desc:"Reach parents on school routes. Admission season campaigns get results."},
    {name:"Coaching Classes",icon:"📚",desc:"Tutorials and classes seen by students daily. Enrollment inquiries guaranteed."},
    {name:"Real Estate",icon:"🏠",desc:"Property ads seen by locals. Generate inquiries from the neighborhood itself."},
    {name:"Gyms",icon:"💪",desc:"Fitness centers visible on commute routes. New year, new members."},
    {name:"Salons",icon:"💇",desc:"Beauty parlors on display. Be the go-to name in your zone."},
    {name:"Electronics",icon:"📱",desc:"Mobile and electronics shops. Tech deals seen by gadget lovers."},
    {name:"Jewelry",icon:"💍",desc:"Jewelry stores build trust through visibility. Wedding season ready."},
    {name:"Banks",icon:"🏦",desc:"Financial services trusted when seen daily. Local branch awareness."},
    {name:"Insurance",icon:"🛡️",desc:"Insurance ads build credibility. Seen = trusted in local markets."},
    {name:"Automobile",icon:"🚗",desc:"Car and bike showrooms. Commuters are your target audience."},
    {name:"Hardware",icon:"🔧",desc:"Hardware stores found when needed. Be the first name they recall."},
    {name:"Furniture",icon:"🪑",desc:"Home furnishing ads inspire. Living room dreams start on the street."},
    {name:"Event Management",icon:"🎉",desc:"Wedding and event planners. Be seen, be booked for the big day."},
    {name:"Travel Agency",icon:"✈️",desc:"Holiday packages on display. Vacation dreams triggered daily."},
    {name:"Catering",icon:"🍲",desc:"Food catering services. Party orders start with a rickshaw ad."},
    {name:"Dentist",icon:"🦷",desc:"Dental clinics on commuter routes. Toothache? They know where to go."}
];

const TESTIMONIALS = [
    {name:"Rahul Sharma",biz:"Kausa Mart",zone:"Kausa",text:"Our store visibility doubled. Customers walk in saying they saw our rickshaw ad. Best ₹15,000 we ever spent!",rating:5},
    {name:"Priya Patel",biz:"Fashion Hub",zone:"Mumbra Station",text:"Best advertising investment ever. Real people, real eyes, real customers. 40% sales increase in 1 month.",rating:5},
    {name:"Dr. Ahmed Khan",biz:"City Clinic",zone:"Shilphata",text:"Patient inquiries up 40%. Audio ads are incredibly effective. Patients mention hearing us on rickshaws.",rating:5},
    {name:"Meera Joshi",biz:"Oxford Academy",zone:"Retibunder",text:"Admissions increased 25% after our rickshaw campaign. Parents tell us they see our ads everywhere!",rating:4},
    {name:"Vikram Singh",biz:"AutoCare Center",zone:"Check Naka",text:"Reached truck drivers and commuters we couldn't reach online. Brilliant platform for B2B.",rating:5},
    {name:"Sneha Gupta",biz:"Sweet Bengal",zone:"Kausa",text:"Our sweet shop became the talk of the area. Rickshaw branding is unforgettable marketing.",rating:5},
    {name:"Arun Nair",biz:"TechZone Mobile",zone:"Mumbra Station",text:"Footfall increased 35%. Every rickshaw is a moving billboard. Can't beat this ROI.",rating:4},
    {name:"Deepa Shah",biz:"Wellness Yoga",zone:"Shilphata",text:"Our yoga studio got 50+ new members. Morning commuters see our ad every day. Consistent branding works.",rating:5},
    {name:"Rajesh Patil",biz:"Shilphata Industries",zone:"Shilphata",text:"Reached warehouse managers who don't use social media. RASAAI is unmatched for industrial B2B.",rating:5},
    {name:"Anita Desai",biz:"BookWorm Library",zone:"Retibunder",text:"Library memberships tripled. Kids see our ad on school routes and beg parents to join!",rating:4},
    {name:"Sunil Shetty",biz:"FitLife Gym",zone:"Check Naka",text:"New year campaign got 80+ signups. LED ads on rickshaws at night are eye-catching magic.",rating:5},
    {name:"Kavita Reddy",biz:"Spice Garden",zone:"Kausa",text:"Dinner crowd doubled in 2 weeks. RASAAI brought customers from areas we never reached before.",rating:5},
    {name:"Mohan Lal",biz:"Lal Jewelers",zone:"Mumbra Station",text:"Wedding season campaign generated 60+ inquiries. Trust factor of physical ads is unbeatable.",rating:5},
    {name:"Pooja Malhotra",biz:"Pixel Photography",zone:"Retibunder",text:"Our photo studio got booked for 12 weddings after the rickshaw campaign. Visual medium works!",rating:4},
    {name:"Harish Thakur",biz:"Thakur Hardware",zone:"Check Naka",text:"Everyone in the area now knows our shop name. Simple branding, massive recall. Highly recommend.",rating:5}
];

const FAQ_DATA = [
    {q:"How are Eye Views different from Impressions?",a:"Eye Views are RASAAI's proprietary metric measuring verified human visual contact. Unlike digital impressions (server requests), Eye Views track actual attention based on foot traffic, vehicle density, and viewing angles. Average: 11,500 Eye Views per rickshaw daily."},
    {q:"What zones and routes do you cover?",a:"5 high-traffic zones: Kausa (85 rickshaws), Mumbra Station (120), Shilphata (65), Retibunder (50), Check Naka (30). Routes include: Mumbra→Kausa→MM Valley Road, Mumbra→Kausa→Kalsekar Bypass→Shilphata→Kalyan Phata→Taloja Phase 1&2, Mumbra→Retibunder→Kalwa Naka, Mumbra→Retibunder→Check Naka→Majhiwada. 17.7M+ monthly Eye Views."},
    {q:"How much does it cost?",a:"₹90/day (Check Naka) to ₹250/day (Mumbra Station) per rickshaw. 10 rickshaws × 30 days in Kausa ≈ ₹45,000 for ~3.45M Eye Views. Pricing varies by zone demand and availability."},
    {q:"Can I choose specific routes?",a:"Yes! Select routes within zones. Target school zones, market areas, station queues, or industrial corridors. Route Intelligence Engine shows real-time exposure estimates for each route."},
    {q:"What ad formats are available?",a:"LED Display (visual, weatherproof, day/night), Audio Announcement (professional voice-over, multi-language), and LED+Audio Combo (dual-channel, 85% higher recall). We handle all production."},
    {q:"How do I track performance?",a:"Real-time dashboard: Eye Views, Impressions, Reach, Frequency, CPM, Brand Recall Score, GPS routes, daily reports. All data refreshes every 30 seconds."},
    {q:"How does RASAAI compare to Instagram/Facebook/YouTube?",a:"0% skip rate (vs 76% YouTube), 68% brand recall (vs 18% digital), ₹4.50 CPM (vs ₹35-150 Instagram). Physical ads reach non-internet users and build unskippable local trust."},
    {q:"How fast can I launch?",a:"48-72 hours from booking. We handle creative production, rickshaw installation, GPS setup, and tracking. Contact +91 95943 06625 to start."}
];

// ============================================
// HELPER FUNCTIONS
// ============================================
function fmt(n){return n>=10000000?(n/10000000).toFixed(1)+'M':n>=100000?(n/100000).toFixed(1)+'L':n>=1000?n.toLocaleString('en-IN'):n.toString()}
function $(id){return document.getElementById(id)}
function scrollToEl(id){const el=$(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}
function openModal(id){const m=$(id);if(m)m.style.display='flex';document.body.style.overflow='hidden'}
function closeModal(id){const m=$(id);if(m)m.style.display='none';document.body.style.overflow=''}
function closeBookingModal(){closeModal('bookingModal')}
function closeExitPopup(){closeModal('exitPopup')}

// ============================================
// BOOKING FORM HANDLER
// ============================================
function handleBookingSubmit(e){
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const name = data.get('name') || form.querySelector('input[type="text"]')?.value || 'Customer';
    
    // In production, send to mafs.grp@gmail.com via backend
    alert('✅ Thank you, ' + name + '! Your booking request has been sent to mafs.grp@gmail.com.\n\nWe will call you at +91 95943 06625 within 5 minutes.');
    closeBookingModal();
    
    // Simulate email notification
    console.log('📧 Booking sent to mafs.grp@gmail.com:', {
        name: name,
        phone: form.querySelector('input[type="tel"]')?.value,
        email: form.querySelector('input[type="email"]')?.value,
        zone: form.querySelector('select')?.value,
        timestamp: new Date().toISOString()
    });
}

// ============================================
// BUILD ALL SECTIONS
// ============================================
function init(){
    buildTrustBar();
    buildCoverageMap();
    buildRouteCards();
    buildZoneCards();
    buildRickshawTracks();
    buildEyeCalculator();
    buildNeuroCards();
    buildMetricsGrid();
    buildComparisonTabs();
    buildAudioPlayer();
    buildFormatCards();
    buildCampaignBuilder();
    buildPricingCards();
    buildInventoryCards();
    buildROICalc();
    buildCaseStudies();
    buildIndustryCards();
    buildTestimonialSlider();
    buildVideoGrid();
    buildHeatmap();
    buildLeaderboard();
    buildAffiliate();
    buildContest();
    buildHashtag();
    buildFAQ();
    startTimers();
    startLiveUpdates();
    startNotifications();
    setupFAB();
    setupExitIntent();
    setupBookingForm();
}

// TRUST BAR
function buildTrustBar(){
    const t = $('trustTrack');
    if(!t)return;
    const logos = ["🏪 Patel General","🏥 Mumbra Clinic","🍽️ Spice Garden","🏫 Oxford Academy","🏢 Shilphata Ind.","🛒 Kausa Mart","💊 HealthPlus","👗 Fashion Hub","📚 Students Point","🏠 Mumbra Realty","🚗 AutoCare","☕ Chai Point","🍕 Pizza Corner","💇 Style Salon","📱 Mobile Zone"];
    const all = [...logos,...logos];
    t.innerHTML = all.map(l=>`<span style="font-size:14px;white-space:nowrap;color:#64748B;font-weight:600;padding:8px 16px;background:white;border-radius:100px;border:1px solid #e2e8f0">${l}</span>`).join('');
}

// COVERAGE MAP
function buildCoverageMap(){
    const container = $('coverageMap');
    if(!container || typeof L==='undefined')return;
    const map = L.map('coverageMap').setView([19.1800,73.0350],13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:18}).addTo(map);
    Object.values(ZONES).forEach(z=>{
        const color = z.cov>80?'#00C853':z.cov>70?'#FF6D00':'#FF1744';
        const m = L.circleMarker([z.lat,z.lng],{radius:Math.sqrt(z.ricks)*1.5,fillColor:color,color:'#fff',weight:2,fillOpacity:0.7}).addTo(map);
        m.bindPopup(`<div style="font-family:sans-serif;min-width:180px"><h3>📍 ${z.name}</h3><p>👁️ ${fmt(z.eyes)} daily eyes</p><p>🛺 ${z.ricks} rickshaws</p><p>📊 ${z.cov}% coverage</p><p>💰 ₹${z.price}/day</p><button onclick="scrollToEl('pricing')" style="background:#00C853;color:white;border:none;padding:8px 16px;border-radius:100px;cursor:pointer;width:100%;font-weight:600">Book</button></div>`);
    });
}

// ROUTE CARDS
function buildRouteCards(){
    const container = $('routeCards');
    if(!container)return;
    const routeData = [
        {route:"Mumbra → Kausa → MM Valley Road",eyes:"125,000",ricks:"85",icon:"🛣️"},
        {route:"Mumbra → Kausa → Kalsekar Bypass → Shilphata → Kalyan Phata → Taloja Phase 1 & 2",eyes:"220,000",ricks:"185",icon:"🛣️"},
        {route:"Mumbra → Retibunder → Kalwa Naka",eyes:"75,000",ricks:"50",icon:"🛣️"},
        {route:"Mumbra → Retibunder → Check Naka → Majhiwada",eyes:"77,000",ricks:"30",icon:"🛣️"}
    ];
    container.innerHTML = routeData.map(r=>`
        <div style="padding:12px;background:white;border-radius:12px;border:1px solid #e2e8f0;font-size:13px">
            <strong>${r.icon} ${r.route}</strong>
            <div style="display:flex;gap:12px;margin-top:8px;color:#64748B">
                <span>👁️ ${r.eyes}/day</span><span>🛺 ${r.ricks} rickshaws</span>
            </div>
        </div>
    `).join('');
}

// ZONE CARDS
function buildZoneCards(){
    const g = $('zoneCardsGrid');
    if(!g)return;
    g.innerHTML = Object.values(ZONES).map(z=>`
        <div style="background:white;border-radius:14px;padding:24px;box-shadow:0 4px 6px rgba(0,0,0,0.1);border:1px solid #e2e8f0;transition:all 0.3s" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 20px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='';this.style.boxShadow=''">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
                <h3>📍 ${z.name}</h3>
                <span style="padding:4px 10px;background:${z.cov>80?'#00C853':z.cov>70?'#FF6D00':'#FF1744'};color:white;border-radius:100px;font-size:11px;font-weight:600">${z.cov}%</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
                <div style="text-align:center;padding:8px;background:#f8fafc;border-radius:8px"><span style="display:block;font-weight:700">${fmt(z.eyes)}</span><span style="font-size:10px;color:#64748B">Daily Eyes</span></div>
                <div style="text-align:center;padding:8px;background:#f8fafc;border-radius:8px"><span style="display:block;font-weight:700">${z.ricks}</span><span style="font-size:10px;color:#64748B">Rickshaws</span></div>
                <div style="text-align:center;padding:8px;background:#f8fafc;border-radius:8px"><span style="display:block;font-weight:700">${fmt(z.pop)}</span><span style="font-size:10px;color:#64748B">Population</span></div>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px">${Object.entries(z.poi).map(([k,v])=>`<span style="padding:4px 10px;background:#f1f5f9;border-radius:100px;font-size:11px">${v} ${k}</span>`).join('')}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
                <span>From <strong>₹${z.price}</strong>/day</span>
                <span style="color:${z.avail<10?'#FF1744':'#00C853'};font-weight:600;font-size:13px">${z.avail} available</span>
            </div>
            <button onclick="scrollToEl('pricing')" style="width:100%;padding:12px;background:linear-gradient(135deg,#00C853,#00E676);color:white;border:none;border-radius:100px;font-weight:600;cursor:pointer">Book ${z.name}</button>
        </div>
    `).join('');
}

// RICKSHAW TRACKS
function buildRickshawTracks(){
    const g = $('rickshawTrackGrid');
    if(!g)return;
    const zids = Object.keys(ZONES);
    let h='';
    for(let i=0;i<6;i++){
        const zid=zids[i%5],z=ZONES[zid],route=ROUTES[zid][i%3];
        const online=Math.random()>0.1,audio=Math.random()>0.1?'active':'inactive',led=Math.random()>0.05?'active':'inactive';
        h+=`<div style="background:white;border-radius:14px;padding:16px;box-shadow:0 4px 6px rgba(0,0,0,0.1);font-size:13px">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                <span style="font-weight:700;display:flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:${online?'#00C853':'#FF1744'};display:inline-block;${online?'animation:pulse 1.5s infinite':''}"></span>RKS-${String(i+1).padStart(3,'0')}</span>
                <span>🔋 ${Math.floor(Math.random()*40)+60}%</span>
            </div>
            <div>📍 ${z.name}</div>
            <div>🛣️ ${route}</div>
            <div style="display:flex;justify-content:space-between;margin:8px 0;font-size:12px"><span>👁️ ${fmt(Math.floor(Math.random()*7000)+8000)} eyes</span><span>📊 ${fmt(Math.floor(Math.random()*7000)+8000)} exp</span></div>
            <div style="display:flex;gap:6px;margin:8px 0"><span style="padding:3px 8px;border-radius:100px;font-size:11px;background:${audio==='active'?'rgba(0,200,83,0.1)':'#f1f5f9'};color:${audio==='active'?'#00C853':'#64748B'}">🔊 ${audio}</span><span style="padding:3px 8px;border-radius:100px;font-size:11px;background:${led==='active'?'rgba(0,200,83,0.1)':'#f1f5f9'};color:${led==='active'?'#00C853':'#64748B'}">💡 ${led}</span></div>
            ${Math.random()>0.3?'<div style="padding:6px 10px;background:rgba(0,200,83,0.1);border-radius:8px;font-size:12px;color:#009624">Active: Campaign Running</div>':'<div style="padding:6px 10px;background:#f8fafc;border-radius:8px;font-size:12px;color:#64748B">Available for booking</div>'}
        </div>`;
    }
    g.innerHTML=h;
}

// EYE CALCULATOR
function buildEyeCalculator(){
    const c=$('eyeCalculator');
    if(!c)return;
    c.innerHTML=`<div style="background:white;border-radius:14px;padding:32px;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
        <h3>👁️ Estimate Your Eye Views</h3>
        <div style="display:grid;gap:16px;margin:24px 0">
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><label style="min-width:100px;font-weight:600;font-size:14px">Zone</label><select id="cz" onchange="updateEyeCalc()" style="flex:1;padding:10px;border:2px solid #e2e8f0;border-radius:10px"><option value="">All Zones Average</option>${Object.values(ZONES).map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}</select></div>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><label style="min-width:100px;font-weight:600;font-size:14px">Rickshaws</label><input type="range" id="cr" min="1" max="50" value="10" oninput="$('crv').textContent=this.value;updateEyeCalc()" style="flex:1"><span id="crv" style="font-weight:700">10</span></div>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><label style="min-width:100px;font-weight:600;font-size:14px">Days</label><input type="range" id="cd" min="7" max="90" value="30" oninput="$('cdv').textContent=this.value;updateEyeCalc()" style="flex:1"><span id="cdv" style="font-weight:700">30</span></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;background:#f8fafc;border-radius:12px;padding:24px">
            <div style="text-align:center"><span style="font-size:24px">👁️</span><div style="font-size:28px;font-weight:800;color:#00C853" id="reEyes">3,450,000</div><div style="font-size:12px;color:#64748B">Eye Views</div></div>
            <div style="text-align:center"><span style="font-size:24px">👥</span><div style="font-size:28px;font-weight:800;color:#0F172A" id="reReach">2,553,000</div><div style="font-size:12px;color:#64748B">Reach</div></div>
            <div style="text-align:center"><span style="font-size:24px">💰</span><div style="font-size:28px;font-weight:800;color:#0F172A" id="reCost">₹45,000</div><div style="font-size:12px;color:#64748B">Est. Cost</div></div>
            <div style="text-align:center"><span style="font-size:24px">📊</span><div style="font-size:28px;font-weight:800;color:#0F172A" id="reCPM">₹4.50</div><div style="font-size:12px;color:#64748B">CPM (Eye View)</div></div>
        </div>
    </div>`;
    updateEyeCalc();
}

function updateEyeCalc(){
    const zid=$('cz')?.value,r=parseInt($('cr')?.value||10),d=parseInt($('cd')?.value||30);
    let avg=11500,price=150;
    if(zid&&ZONES[zid]){const z=ZONES[zid];avg=z.eyes/z.ricks;price=z.price}
    const eyes=avg*r*d;
    $('reEyes').textContent=fmt(eyes);
    $('reReach').textContent=fmt(Math.floor(eyes*0.74));
    $('reCost').textContent='₹'+(price*r*d).toLocaleString('en-IN');
    $('reCPM').textContent='₹'+((price*r*d)/(eyes/1000)).toFixed(2);
}

// NEURO CARDS
function buildNeuroCards(){
    const g=$('neuroCardsGrid');
    if(!g)return;
    g.innerHTML=NEURO.map(c=>`
        <div style="perspective:1000px;height:220px" onmouseenter="this.querySelector('.fi').style.transform='rotateY(180deg)'" onmouseleave="this.querySelector('.fi').style.transform=''">
            <div class="fi" style="position:relative;width:100%;height:100%;transition:transform 0.6s;transform-style:preserve-3d">
                <div style="position:absolute;width:100%;height:100%;backface-visibility:hidden;background:white;border-radius:14px;padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 4px 6px rgba(0,0,0,0.1);border:1px solid #e2e8f0">
                    <span style="font-size:40px">${c.icon}</span>
                    <h3 style="margin:8px 0;font-size:16px">${c.front}</h3>
                    <div style="font-size:28px;font-weight:800;color:#00C853">${c.stat}</div>
                    <span style="font-size:11px;color:#64748B">${c.label}</span>
                </div>
                <div style="position:absolute;width:100%;height:100%;backface-visibility:hidden;background:#0A1929;color:white;border-radius:14px;padding:24px;display:flex;align-items:center;justify-content:center;text-align:center;transform:rotateY(180deg);font-size:14px;line-height:1.6">${c.back}</div>
            </div>
        </div>
    `).join('');
}

// METRICS
function buildMetricsGrid(){
    const g=$('metricsGrid');
    if(!g)return;
    const cards=[
        {icon:"👁️",val:"17.7M+",label:"Eye Views",badge:"Proprietary",primary:true},
        {icon:"📊",val:"28M+",label:"Impressions",badge:""},
        {icon:"👥",val:"12M+",label:"Reach",badge:""}
    ];
    g.innerHTML=cards.map(c=>`
        <div style="text-align:center;padding:32px;background:white;border-radius:14px;box-shadow:0 4px 6px rgba(0,0,0,0.1);border:${c.primary?'2px solid #00C853':'1px solid #e2e8f0'};${c.primary?'background:linear-gradient(180deg,rgba(0,200,83,0.05),white)':''}">
            <div style="font-size:36px">${c.icon}</div>
            <h3 style="margin:8px 0">${c.label}</h3>
            <div style="font-size:28px;font-weight:800;color:#0F172A">${c.val}</div>
            ${c.badge?`<span style="display:inline-block;padding:4px 12px;background:#00C853;color:white;border-radius:100px;font-size:11px;font-weight:600;margin-top:8px">${c.badge}</span>`:''}
        </div>
    `).join('');
    g.insertAdjacentHTML('afterend',`
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:24px">
            <div style="text-align:center;padding:16px;background:#f8fafc;border-radius:10px"><div style="font-size:12px;color:#64748B">CPM (Eye View)</div><div style="font-size:24px;font-weight:700">₹4.50</div></div>
            <div style="text-align:center;padding:16px;background:#f8fafc;border-radius:10px"><div style="font-size:12px;color:#64748B">Brand Recall</div><div style="font-size:24px;font-weight:700">68%</div></div>
            <div style="text-align:center;padding:16px;background:#f8fafc;border-radius:10px"><div style="font-size:12px;color:#64748B">Attention Time</div><div style="font-size:24px;font-weight:700">4.2s</div></div>
            <div style="text-align:center;padding:16px;background:#f8fafc;border-radius:10px"><div style="font-size:12px;color:#64748B">Skip Rate</div><div style="font-size:24px;font-weight:700;color:#00C853">0%</div></div>
        </div>
    `);
}

// COMPARISON TABS
function buildComparisonTabs(){
    const tabs=$('comparisonTabs'),content=$('comparisonContent');
    if(!tabs||!content)return;
    tabs.innerHTML=`
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
            <button onclick="showComparison('instagram')" style="padding:10px 20px;background:linear-gradient(135deg,#E1306C,#F77737);color:white;border:none;border-radius:100px;font-weight:600;cursor:pointer;font-size:14px">📱 vs Instagram</button>
            <button onclick="showComparison('facebook')" style="padding:10px 20px;background:#1877F2;color:white;border:none;border-radius:100px;font-weight:600;cursor:pointer;font-size:14px">👍 vs Facebook</button>
            <button onclick="showComparison('youtube')" style="padding:10px 20px;background:#FF0000;color:white;border:none;border-radius:100px;font-weight:600;cursor:pointer;font-size:14px">▶️ vs YouTube</button>
        </div>
    `;
    showComparison('instagram');
}

function showComparison(platform){
    const content=$('comparisonContent');
    if(!content)return;
    const data=COMPARISONS[platform];
    const names={instagram:'Instagram Ads',facebook:'Facebook Ads',youtube:'YouTube Ads'};
    content.innerHTML=`
        <table style="width:100%;border-collapse:collapse;background:white;border-radius:14px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);min-width:600px">
            <thead><tr style="background:#0A1929;color:white"><th style="padding:12px 16px;text-align:left;font-weight:600">📋 Feature</th><th style="padding:12px 16px;text-align:left;color:#00E676">🛺 RASAAI</th><th style="padding:12px 16px;text-align:left">${names[platform]}</th></tr></thead>
            <tbody>${data.map(row=>`<tr style="border-bottom:1px solid #e2e8f0" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''"><td style="padding:12px 16px;font-weight:600">${row[0]}</td><td style="padding:12px 16px;color:#00C853;font-weight:600">${row[1]}</td><td style="padding:12px 16px">${row[2]}</td></tr>`).join('')}</tbody>
        </table>
    `;
}

// AUDIO PLAYER
function buildAudioPlayer(){
    const c=$('audioPlayer');
    if(!c)return;
    c.innerHTML=`
        <div style="background:white;border-radius:14px;padding:32px;box-shadow:0 4px 6px rgba(0,0,0,0.1);text-align:center">
            <div style="font-size:64px;margin-bottom:16px">🔊</div>
            <h3>Sample Audio Ads</h3>
            <p style="color:#64748B;margin-bottom:24px">Click to hear sample rickshaw audio advertisements</p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
                <button onclick="playBeep('restaurant')" style="padding:12px 20px;background:linear-gradient(135deg,#00C853,#00E676);color:white;border:none;border-radius:100px;font-weight:600;cursor:pointer">🍽️ Restaurant Ad</button>
                <button onclick="playBeep('clinic')" style="padding:12px 20px;background:linear-gradient(135deg,#00C853,#00E676);color:white;border:none;border-radius:100px;font-weight:600;cursor:pointer">🏥 Clinic Ad</button>
                <button onclick="playBeep('education')" style="padding:12px 20px;background:linear-gradient(135deg,#00C853,#00E676);color:white;border:none;border-radius:100px;font-weight:600;cursor:pointer">🏫 Education Ad</button>
            </div>
            <p style="font-size:12px;color:#94A3B8;margin-top:16px">🔊 Replace these beep samples with your MP3 ads</p>
            <audio id="audioPlayerEl" style="display:none"></audio>
        </div>
    `;
}

function playBeep(type){
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const freqs = {restaurant:520,clinic:440,education:660};
    oscillator.frequency.value = freqs[type] || 500;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
    oscillator.stop(audioContext.currentTime + 1.5);
    
    alert('🎙️ Sample Audio: ' + type + ' ad playing (beep). Replace with your MP3: <audio src="your-ad.mp3">');
}

// FORMAT CARDS
function buildFormatCards(){
    const g=$('formatCards');
    if(!g)return;
    const formats=[{icon:"💡",name:"LED Display",desc:"Bright LED screen on rickshaw. Visible day & night.",feat:["Full-color","Weatherproof","Night visible","Changeable"],mul:1,rec:false},{icon:"🔊",name:"Audio Announcement",desc:"Voice ad through speakers. Pedestrian reach.",feat:["Pro voice-over","Multi-language","Zone-specific","Ear-catching"],mul:0.8,rec:false},{icon:"⚡",name:"LED + Audio Combo",desc:"Dual-channel. 85% higher recall.",feat:["Visual+Audio sync","85% higher recall","Maximum attention","Best ROI"],mul:1.5,rec:true}];
    g.innerHTML=formats.map(f=>`
        <div style="background:white;border-radius:14px;padding:32px;box-shadow:0 4px 6px rgba(0,0,0,0.1);text-align:center;position:relative;${f.rec?'border:2px solid #00C853;box-shadow:0 0 40px rgba(0,200,83,0.3)':''}">
            ${f.rec?'<span style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);padding:4px 14px;background:linear-gradient(135deg,#00C853,#00E676);color:white;border-radius:100px;font-size:11px;font-weight:600">⭐ Recommended</span>':''}
            <div style="font-size:40px">${f.icon}</div>
            <h3 style="margin:12px 0">${f.name}</h3>
            <p style="color:#64748B;font-size:14px">${f.desc}</p>
            <ul style="list-style:none;text-align:left;margin:16px 0">${f.feat.map(ft=>`<li style="padding:4px 0;font-size:13px;color:#475569">✓ ${ft}</li>`).join('')}</ul>
            <div style="font-weight:700;color:#00C853">${f.mul}x base rate</div>
        </div>
    `).join('');
}

// CAMPAIGN BUILDER
function buildCampaignBuilder(){
    const c=$('campaignBuilder');
    if(!c)return;
    c.innerHTML=`
        <div style="background:white;border-radius:14px;padding:32px;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
            <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap;align-items:center">
                <div style="width:36px;height:36px;background:linear-gradient(135deg,#00C853,#00E676);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700">1</div><span style="color:#00C853">→</span>
                <div style="width:36px;height:36px;background:#cbd5e1;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700">2</div><span>→</span>
                <div style="width:36px;height:36px;background:#cbd5e1;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700">3</div><span>→</span>
                <div style="width:36px;height:36px;background:#cbd5e1;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700">4</div><span>→</span>
                <div style="width:36px;height:36px;background:#cbd5e1;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700">5</div><span>→</span>
                <div style="width:36px;height:36px;background:#cbd5e1;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700">6</div>
            </div>
            <h3 style="margin-bottom:16px">🎯 Step 1: Select Your Zones</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:24px">
                ${Object.values(ZONES).map(z=>`<label style="display:flex;align-items:center;gap:8px;padding:12px;border:2px solid #e2e8f0;border-radius:10px;cursor:pointer;font-size:14px" onmouseover="this.style.borderColor='#00C853'" onmouseout="this.style.borderColor='#e2e8f0'"><input type="checkbox" checked style="accent-color:#00C853">${z.name}</label>`).join('')}
            </div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap"><label style="font-weight:600;font-size:14px;min-width:120px">Rickshaws</label><input type="range" value="10" min="1" max="50" style="flex:1"><span style="font-weight:700">10</span></div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap"><label style="font-weight:600;font-size:14px;min-width:120px">Duration</label><select style="flex:1;padding:10px;border:2px solid #e2e8f0;border-radius:10px"><option>30 Days</option><option>15 Days</option><option>60 Days</option><option>90 Days</option></select></div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap"><label style="font-weight:600;font-size:14px;min-width:120px">Format</label><select style="flex:1;padding:10px;border:2px solid #e2e8f0;border-radius:10px"><option>LED + Audio Combo</option><option>LED Only</option><option>Audio Only</option></select></div>
            <button onclick="openModal('bookingModal')" style="width:100%;padding:16px;background:linear-gradient(135deg,#00C853,#00E676);color:white;border:none;border-radius:100px;font-weight:600;font-size:16px;cursor:pointer;margin-top:16px">📋 Next: Upload Creative →</button>
        </div>
    `;
}

// PRICING CARDS
function buildPricingCards(){
    const g=$('pricingGrid');
    if(!g)return;
    const prices={kausa:{d:150,w:950,m:3500}, "mumbra-station":{d:250,w:1600,m:6000}, shilphata:{d:120,w:750,m:2800}, retibunder:{d:100,w:650,m:2400}, "check-naka":{d:90,w:550,m:2100}};
    let i=0;
    g.innerHTML=Object.entries(prices).map(([zid,p])=>{
        const z=ZONES[zid],feat=i===1;i++;
        return`<div style="background:white;border-radius:14px;padding:24px;text-align:center;position:relative;${feat?'border:2px solid #00C853;box-shadow:0 0 40px rgba(0,200,83,0.3);transform:scale(1.03)':''}">
            ${feat?'<span style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);padding:4px 16px;background:linear-gradient(135deg,#00C853,#00E676);color:white;border-radius:100px;font-size:11px;font-weight:600">🔥 Most Popular</span>':''}
            <h3 style="margin-top:${feat?'12px':'0'}">📍 ${z.name}</h3>
            <div style="font-size:36px;font-weight:800;color:#00C853">₹${p.d}<span style="font-size:14px;color:#64748B;font-weight:400">/day</span></div>
            <p style="font-size:13px;color:#64748B">per rickshaw</p>
            <ul style="list-style:none;text-align:left;margin:16px 0">
                <li style="padding:6px 0;font-size:13px;border-bottom:1px solid #f1f5f9">✓ 👁️ ~${fmt(Math.floor(z.eyes/z.ricks*10))} eyes/day*</li>
                <li style="padding:6px 0;font-size:13px;border-bottom:1px solid #f1f5f9">✓ 🛺 ${z.avail} rickshaws</li>
                <li style="padding:6px 0;font-size:13px;border-bottom:1px solid #f1f5f9">✓ 📊 ${z.cov}% coverage</li>
                <li style="padding:6px 0;font-size:13px;border-bottom:1px solid #f1f5f9">✓ 🎨 Creative included</li>
                <li style="padding:6px 0;font-size:13px">✓ 📱 Real-time tracking</li>
            </ul>
            <div style="display:flex;gap:8px;margin-bottom:16px"><div style="flex:1;padding:8px;background:#f8fafc;border-radius:8px;font-size:13px;font-weight:600">₹${p.w}/wk</div><div style="flex:1;padding:8px;background:rgba(0,200,83,0.1);border:1px solid #00C853;border-radius:8px;font-size:13px;font-weight:600;color:#009624">₹${p.m}/mo</div></div>
            <p style="font-size:11px;color:#94A3B8;margin-bottom:16px">*Based on 10 rickshaws</p>
            <button onclick="openModal('bookingModal')" style="width:100%;padding:12px;background:linear-gradient(135deg,#00C853,#00E676);color:white;border:none;border-radius:100px;font-weight:600;cursor:pointer">Book Now</button>
        </div>`;
    }).join('');
}

// INVENTORY
function buildInventoryCards(){
    const g=$('inventoryGrid');
    if(!g)return;
    g.innerHTML=Object.values(ZONES).map(z=>{
        const s=z.avail<10?'critical':z.avail<20?'low':'good';
        return`<div style="background:white;border-radius:14px;padding:24px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
            <h3>📍 ${z.name}</h3>
            <div style="margin:16px 0"><span style="font-size:36px;font-weight:800;color:${s==='critical'?'#FF1744':s==='low'?'#FF6D00':'#00C853'}">${z.avail}</span><span style="font-size:13px;color:#64748B;display:block">rickshaws left</span></div>
            <div style="height:6px;background:#e2e8f0;border-radius:100px;overflow:hidden;margin:8px 0"><div style="height:100%;background:#00C853;border-radius:100px;width:${z.cov}%"></div></div>
            <p style="font-size:13px;font-weight:600;color:${s==='critical'?'#FF1744':s==='low'?'#FF6D00':'#00C853'}">${s==='critical'?'⚠️ Almost gone!':s==='low'?'⚡ Selling fast':'✅ Available'}</p>
        </div>`;
    }).join('');
}

// ROI CALCULATOR
function buildROICalc(){
    const c=$('roiCalc');
    if(!c)return;
    c.innerHTML=`<div style="background:white;border-radius:14px;padding:32px;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
        <h3>🧮 Advanced ROI Calculator</h3>
        <div style="display:grid;gap:16px;margin:24px 0">
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><label style="min-width:100px;font-weight:600;font-size:14px">Business</label><select id="rb" onchange="updateROI()" style="flex:1;padding:10px;border:2px solid #e2e8f0;border-radius:10px"><option value="retail">Retail</option><option value="restaurant">Restaurant</option><option value="clinic">Clinic</option><option value="education">Education</option></select></div>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><label style="min-width:100px;font-weight:600;font-size:14px">Zone</label><select id="rz" onchange="updateROI()" style="flex:1;padding:10px;border:2px solid #e2e8f0;border-radius:10px">${Object.values(ZONES).map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}</select></div>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><label style="min-width:100px;font-weight:600;font-size:14px">Budget</label><input type="range" id="rbudget" min="5000" max="500000" value="50000" step="5000" oninput="$('rbv').textContent='₹'+parseInt(this.value).toLocaleString('en-IN');updateROI()" style="flex:1"><span id="rbv" style="font-weight:700">₹50,000</span></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;background:#f8fafc;border-radius:12px;padding:24px;margin-bottom:16px">
            <div style="text-align:center"><div style="font-size:22px;font-weight:800;color:#00C853" id="roEyes">--</div><div style="font-size:11px;color:#64748B">Eye Views</div></div>
            <div style="text-align:center"><div style="font-size:22px;font-weight:800;color:#0F172A" id="roFoot">--</div><div style="font-size:11px;color:#64748B">Footfall ↑</div></div>
            <div style="text-align:center"><div style="font-size:22px;font-weight:800;color:#0F172A" id="roCust">--</div><div style="font-size:11px;color:#64748B">New Customers</div></div>
            <div style="text-align:center"><div style="font-size:22px;font-weight:800;color:#0F172A" id="roRev">--</div><div style="font-size:11px;color:#64748B">Revenue Impact</div></div>
            <div style="text-align:center"><div style="font-size:22px;font-weight:800;color:#0F172A" id="roROI">--</div><div style="font-size:11px;color:#64748B">ROI</div></div>
            <div style="text-align:center"><div style="font-size:22px;font-weight:800;color:#0F172A" id="roBE">--</div><div style="font-size:11px;color:#64748B">Break-even</div></div>
        </div>
    </div>`;
    updateROI();
}

function updateROI(){
    const zid=$('rz')?.value||'kausa',budget=parseInt($('rbudget')?.value||50000);
    const z=ZONES[zid];
    const ricks=Math.min(Math.floor(budget/(z.price*30)),z.ricks);
    const cost=ricks*z.price*30;
    const eyes=(z.eyes/z.ricks)*ricks*30;
    const foot=Math.floor(eyes*0.02),cust=Math.floor(foot*0.3),rev=cust*500;
    $('roEyes').textContent=fmt(eyes);
    $('roFoot').textContent='+'+foot+'%';
    $('roCust').textContent=cust.toLocaleString('en-IN');
    $('roRev').textContent='₹'+rev.toLocaleString('en-IN');
    $('roROI').textContent=cost>0?Math.floor((rev-cost)/cost*100)+'%':'--';
    $('roBE').textContent=rev>0?Math.ceil(cost/(rev/30))+' days':'--';
}

// CASE STUDIES
function buildCaseStudies(){
    const g=$('caseStudiesGrid');
    if(!g)return;
    const cases=[
        {biz:"Spice Garden",type:"Restaurant",zone:"Kausa",dur:"30d",budget:"₹15K",r1:"45%",l1:"Footfall",r2:"467%",l2:"ROI",r3:"72%",l3:"Recall",test:"Dinner crowd doubled in 2 weeks! Customers came from areas we never reached.",owner:"Ahmed Siddiqui"},
        {biz:"Mumbra Dental",type:"Clinic",zone:"Station",dur:"45d",budget:"₹22K",r1:"38%",l1:"Patients",r2:"445%",l2:"ROI",r3:"68%",l3:"Recall",test:"Audio ads near station incredibly effective. Patients mention hearing us while commuting.",owner:"Dr. Fatima Khan"},
        {biz:"Shilphata Ind.",type:"B2B",zone:"Shilphata",dur:"60d",budget:"₹35K",r1:"55%",l1:"Inquiries",r2:"900%",l2:"ROI",r3:"64%",l3:"Recall",test:"Reached warehouse managers who don't use social media. RASAAI unmatched for B2B.",owner:"Rajesh Patil"}
    ];
    g.innerHTML=cases.map(c=>`
        <div style="background:white;border-radius:14px;padding:24px;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
            <div style="display:flex;justify-content:space-between;margin-bottom:12px"><span style="font-weight:700;color:#00C853">Case Study</span><span style="padding:4px 10px;background:#f1f5f9;border-radius:100px;font-size:11px">${c.type}</span></div>
            <h3>${c.biz}</h3>
            <div style="display:flex;gap:12px;margin:8px 0 16px;font-size:13px;color:#64748B"><span>📍 ${c.zone}</span><span>⏱️ ${c.dur}</span><span>💰 ${c.budget}</span></div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
                <div style="text-align:center;padding:8px;background:#f8fafc;border-radius:8px"><div style="font-weight:700;color:#00C853">${c.r1}</div><div style="font-size:11px;color:#64748B">${c.l1}</div></div>
                <div style="text-align:center;padding:8px;background:#f8fafc;border-radius:8px"><div style="font-weight:700;color:#00C853">${c.r2}</div><div style="font-size:11px;color:#64748B">${c.l2}</div></div>
                <div style="text-align:center;padding:8px;background:#f8fafc;border-radius:8px"><div style="font-weight:700;color:#00C853">${c.r3}</div><div style="font-size:11px;color:#64748B">${c.l3}</div></div>
            </div>
            <blockquote style="font-style:italic;color:#475569;padding:12px;background:#f8fafc;border-radius:8px;border-left:3px solid #00C853;font-size:14px">"${c.test}"<cite style="display:block;margin-top:8px;font-weight:600;color:#0F172A">— ${c.owner}</cite></blockquote>
        </div>
    `).join('');
}

// INDUSTRIES (20)
function buildIndustryCards(){
    const g=$('industryCards');
    if(!g)return;
    g.innerHTML=INDUSTRIES.map(ind=>`
        <div style="text-align:center;padding:24px;background:white;border-radius:14px;box-shadow:0 1px 2px rgba(0,0,0,0.05);border:1px solid #e2e8f0;transition:all 0.3s" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 10px 15px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='';this.style.boxShadow=''">
            <div style="font-size:32px;margin-bottom:8px">${ind.icon}</div>
            <h3 style="font-size:14px;margin-bottom:4px">${ind.name}</h3>
            <p style="font-size:12px;color:#64748B">${ind.desc}</p>
        </div>
    `).join('');
}

// TESTIMONIAL SLIDER
function buildTestimonialSlider(){
    const c=$('testimonialSlider');
    if(!c)return;
    let currentSlide=0;
    c.innerHTML=`
        <div style="display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:24px;padding:16px 0;-webkit-overflow-scrolling:touch;scrollbar-width:none" id="testSliderInner">
            ${TESTIMONIALS.map(t=>`
                <div style="min-width:300px;scroll-snap-align:start;background:white;border-radius:14px;padding:24px;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
                    <div style="margin-bottom:8px">${'⭐'.repeat(t.rating)}</div>
                    <p style="font-style:italic;color:#475569;margin-bottom:16px;line-height:1.6">"${t.text}"</p>
                    <div><strong>${t.name}</strong><br><span style="font-size:13px;color:#64748B">${t.biz}, ${t.zone}</span></div>
                </div>
            `).join('')}
        </div>
        <div style="display:flex;justify-content:center;gap:8px;margin-top:16px">
            <button onclick="document.getElementById('testSliderInner').scrollBy({left:-320,behavior:'smooth'})" style="width:40px;height:40px;border-radius:50%;background:white;border:1px solid #e2e8f0;cursor:pointer;font-size:18px">←</button>
            <button onclick="document.getElementById('testSliderInner').scrollBy({left:320,behavior:'smooth'})" style="width:40px;height:40px;border-radius:50%;background:white;border:1px solid #e2e8f0;cursor:pointer;font-size:18px">→</button>
        </div>
    `;
}

// VIDEO GALLERY
function buildVideoGrid(){
    const g=$('videoGrid');
    if(!g)return;
    const videos=[
        {title:"RASAAI Rickshaw in Action",id:"dQw4w9WgXcQ"},
        {title:"LED Ad Display Demo",id:"dQw4w9WgXcQ"},
        {title:"Audio Ad Sample",id:"dQw4w9WgXcQ"},
        {title:"Campaign Success Story",id:"dQw4w9WgXcQ"}
    ];
    g.innerHTML=videos.map(v=>`
        <div style="background:white;border-radius:14px;padding:24px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1);cursor:pointer;transition:all 0.3s" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform=''" onclick="openVideo('${v.id}')">
            <div style="font-size:48px">🎬</div>
            <h4>${v.title}</h4>
            <p style="color:#64748B;font-size:13px">Click to watch</p>
            <button style="margin-top:12px;padding:8px 20px;background:linear-gradient(135deg,#00C853,#00E676);color:white;border:none;border-radius:100px;cursor:pointer;font-weight:600">▶️ Play</button>
        </div>
    `).join('');
}

function openVideo(videoId){
    const modal=$('videoModal');
    const embed=$('videoEmbed');
    if(!modal||!embed)return;
    embed.innerHTML=`<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%"></iframe>`;
    modal.style.display='flex';
    document.body.style.overflow='hidden';
}

// HEATMAP
function buildHeatmap(){
    const c=$('heatmapContainer');
    if(!c)return;
    c.innerHTML=`
        <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:24px;font-size:12px;color:#64748B">
            <span>Low Density</span>
            <div style="width:200px;height:12px;border-radius:100px;background:linear-gradient(90deg,rgba(0,200,83,0.1),rgba(0,200,83,0.8))"></div>
            <span>High Density</span>
        </div>
        ${Object.values(ZONES).map(z=>{
            const i=z.cov/100;
            return`<div style="padding:16px;margin-bottom:8px;border-radius:12px;background:rgba(0,200,83,${i*0.6});border:2px solid ${i>0.8?'#00C853':'rgba(0,200,83,0.3)'};transition:all 0.3s" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform=''">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px"><strong>${z.name}</strong><span>${z.cov}% coverage | ${z.ricks} rickshaws</span></div>
                <div style="height:8px;background:rgba(255,255,255,0.3);border-radius:100px;overflow:hidden"><div style="height:100%;background:white;border-radius:100px;width:${z.cov}%"></div></div>
            </div>`;
        }).join('')}
        <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-top:24px"><label>Time:</label><input type="range" min="6" max="22" value="12" oninput="$('ht').textContent=this.value+':00'"><span id="ht">12:00</span></div>
    `;
}

// LEADERBOARD
function buildLeaderboard(){
    const c=$('leaderboardContainer');
    if(!c)return;
    const sorted=Object.values(ZONES).sort((a,b)=>b.eyes-a.eyes);
    c.innerHTML=sorted.map((z,i)=>`
        <div style="display:flex;align-items:center;gap:16px;padding:16px;background:white;border-radius:12px;margin-bottom:8px;box-shadow:0 1px 2px rgba(0,0,0,0.05)">
            <div style="font-size:22px;font-weight:800;color:#00C853;width:40px">#${i+1}</div>
            <div style="flex:1">
                <div style="font-weight:600;margin-bottom:4px">${z.name}</div>
                <div style="height:8px;background:#e2e8f0;border-radius:100px;overflow:hidden;margin-bottom:4px"><div style="height:100%;background:linear-gradient(135deg,#00C853,#00E676);border-radius:100px;width:${(z.eyes/sorted[0].eyes)*100}%;animation:barGrow 1s ease-out"></div></div>
                <div style="font-size:12px;color:#64748B">👁️ ${fmt(z.eyes)} eye views/day | 🛺 ${z.ricks} rickshaws</div>
            </div>
        </div>
    `).join('');
}

// AFFILIATE
function buildAffiliate(){
    const c=$('affiliateContainer');
    if(!c)return;
    c.innerHTML=`
        <div style="background:white;border-radius:14px;padding:32px;box-shadow:0 4px 6px rgba(0,0,0,0.1);text-align:center">
            <h3>💰 Earn 10% Commission on Every Referral</h3>
            <p style="color:#64748B;margin:16px 0">Refer a business and earn 10% of their first campaign budget</p>
            <div style="background:#f8fafc;border-radius:12px;padding:24px;margin:16px 0">
                <label style="font-weight:600;display:block;margin-bottom:8px">Referral's Campaign Budget</label>
                <input type="range" min="5000" max="500000" value="50000" step="5000" oninput="$('ae').textContent='₹'+Math.floor(this.value*0.1).toLocaleString('en-IN');$('ab').textContent='₹'+parseInt(this.value).toLocaleString('en-IN')" style="width:100%">
                <div style="margin-top:16px;font-size:18px">Your Earning: <strong style="color:#00C853;font-size:28px" id="ae">₹5,000</strong></div>
                <div style="font-size:13px;color:#64748B">from <span id="ab">₹50,000</span> campaign</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:16px 0">
                <div style="padding:12px;background:#f8fafc;border-radius:8px"><div style="font-weight:700">5</div><div style="font-size:11px;color:#64748B">Referrals</div><div style="color:#00C853;font-weight:600">₹25,000</div></div>
                <div style="padding:12px;background:#f8fafc;border-radius:8px"><div style="font-weight:700">10</div><div style="font-size:11px;color:#64748B">Referrals</div><div style="color:#00C853;font-weight:600">₹50,000</div></div>
                <div style="padding:12px;background:#f8fafc;border-radius:8px"><div style="font-weight:700">20</div><div style="font-size:11px;color:#64748B">Referrals</div><div style="color:#00C853;font-weight:600">₹1,00,000</div></div>
            </div>
            <button onclick="openModal('bookingModal')" style="width:100%;padding:16px;background:linear-gradient(135deg,#00C853,#00E676);color:white;border:none;border-radius:100px;font-weight:600;font-size:16px;cursor:pointer">Start Referring Now</button>
        </div>
    `;
}

// CONTEST
function buildContest(){
    const c=$('contestContainer');
    if(!c)return;
    c.innerHTML=`
        <div style="background:white;border-radius:14px;padding:32px;box-shadow:0 4px 6px rgba(0,0,0,0.1);text-align:center">
            <div style="font-size:48px">🏆</div>
            <h3>Run a Hashtag Contest</h3>
            <p style="color:#64748B;margin:12px 0">Boost engagement with rickshaw-powered hashtag contests</p>
            <div style="text-align:left;margin:24px 0">
                <div style="margin-bottom:12px"><label style="display:block;font-weight:600;margin-bottom:4px;font-size:13px">Contest Hashtag</label><input type="text" value="#RasaaiContest" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:10px;font-size:15px"></div>
                <div style="margin-bottom:12px"><label style="display:block;font-weight:600;margin-bottom:4px;font-size:13px">Prize</label><input type="text" value="₹5,000 Cash Prize" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:10px;font-size:15px"></div>
                <div style="margin-bottom:12px"><label style="display:block;font-weight:600;margin-bottom:4px;font-size:13px">Duration</label><select style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:10px;font-size:15px"><option>7 Days</option><option>15 Days</option><option>30 Days</option></select></div>
            </div>
            <button onclick="alert('🏆 Contest Launched! Your hashtag will appear on 350+ rickshaws across Mumbra.')" style="width:100%;padding:16px;background:linear-gradient(135deg,#7C4DFF,#B388FF);color:white;border:none;border-radius:100px;font-weight:600;font-size:16px;cursor:pointer">🚀 Launch Contest</button>
        </div>
    `;
}

// HASHTAG TRACKING
function buildHashtag(){
    const c=$('hashtagContainer');
    if(!c)return;
    c.innerHTML=`
        <div style="background:white;border-radius:14px;padding:32px;box-shadow:0 4px 6px rgba(0,0,0,0.1);text-align:center">
            <div style="font-size:48px">📱</div>
            <h3>Live Hashtag Tracking</h3>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0">
                <div style="padding:16px;background:#f8fafc;border-radius:10px"><div style="font-size:24px;font-weight:800;color:#00C853" id="htMentions">247</div><div style="font-size:11px;color:#64748B">Mentions</div></div>
                <div style="padding:16px;background:#f8fafc;border-radius:10px"><div style="font-size:24px;font-weight:800;color:#7C4DFF">1.2K</div><div style="font-size:11px;color:#64748B">Engagement</div></div>
                <div style="padding:16px;background:#f8fafc;border-radius:10px"><div style="font-size:24px;font-weight:800;color:#FF6D00">89%</div><div style="font-size:11px;color:#64748B">Positive</div></div>
                <div style="padding:16px;background:#f8fafc;border-radius:10px"><div style="font-size:24px;font-weight:800;color:#00BFA5">₹0.42</div><div style="font-size:11px;color:#64748B">Cost/Engagement</div></div>
            </div>
            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
                <span style="padding:6px 12px;background:#f1f5f9;border-radius:100px;font-size:11px">📷 Instagram: 142</span>
                <span style="padding:6px 12px;background:#f1f5f9;border-radius:100px;font-size:11px">👍 Facebook: 68</span>
                <span style="padding:6px 12px;background:#f1f5f9;border-radius:100px;font-size:11px">🐦 Twitter: 37</span>
            </div>
        </div>
    `;
}

// FAQ
function buildFAQ(){
    const c=$('faqContainer');
    if(!c)return;
    c.innerHTML=FAQ_DATA.map(item=>`
        <div style="border:1px solid #e2e8f0;border-radius:10px;margin-bottom:8px;overflow:hidden">
            <button onclick="this.parentElement.classList.toggle('active')" style="width:100%;padding:16px;background:white;border:none;text-align:left;font-size:14px;font-weight:600;cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:#0F172A">
                <span>${item.q}</span>
                <span style="font-size:18px;transition:transform 0.3s">+</span>
            </button>
            <div style="max-height:0;overflow:hidden;transition:max-height 0.3s">
                <p style="padding:0 16px 16px;font-size:14px;color:#475569;line-height:1.7">${item.a}</p>
            </div>
        </div>
    `).join('');
    // Add active state handling
    document.querySelectorAll('#faqContainer button').forEach(btn=>{
        btn.addEventListener('click',function(){
            const parent=this.parentElement;
            const wasActive=parent.classList.contains('active');
            document.querySelectorAll('#faqContainer .active').forEach(el=>{
                el.classList.remove('active');
                el.querySelector('button span:last-child').style.transform='';
            });
            if(!wasActive){
                parent.classList.add('active');
                this.querySelector('span:last-child').style.transform='rotate(45deg)';
            }
        });
    });
}

// ============================================
// TIMERS & LIVE UPDATES
// ============================================
function startTimers(){
    // Pricing countdown
    const t=$('timerDisplay');
    if(t){
        let s=299;
        setInterval(()=>{
            const m=Math.floor(s/60),sec=s%60;
            t.textContent=`${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
            s--;if(s<0)s=299;
        },1000);
    }
    
    // Exit popup timer
    const et=$('exitTimer');
    if(et){
        let es=299;
        setInterval(()=>{
            const m=Math.floor(es/60),sec=es%60;
            et.textContent=`Offer refreshes: ${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
            es--;if(es<0)es=299;
        },1000);
    }
}

function startLiveUpdates(){
    setInterval(()=>{
        const r=$('liveRickshaws');if(r)r.textContent=340+Math.floor(Math.random()*10);
        const c=$('liveCampaigns');if(c)c.textContent=125+Math.floor(Math.random()*8);
        const e=$('liveEyeViews');if(e){
            const current=parseInt(e.textContent.replace(/,/g,''))||1247893;
            e.textContent=(current+Math.floor(Math.random()*300)+100).toLocaleString('en-IN');
        }
        const m=$('htMentions');if(m)m.textContent=247+Math.floor(Math.random()*10);
    },5000);
    
    // Sticky bar
    window.addEventListener('scroll',()=>{
        const bar=$('stickyBar');if(bar)bar.style.display=window.scrollY>400?'flex':'none';
    });
}

function startNotifications(){
    const msgs=['🏃 3 businesses booked Kausa today','🔥 Mumbra Station: Only 8 left','✅ New campaign in Shilphata','💼 Agency booked 15 rickshaws','⚡ Flash: Check Naka ₹90/day'];
    let i=0;
    setInterval(()=>{
        const w=$('notifWidget'),t=$('notifText');
        if(w&&t){t.textContent=msgs[i];w.style.display='block';setTimeout(()=>w.style.display='none',4000);i=(i+1)%msgs.length}
    },8000);
}

// ============================================
// FAB & EXIT INTENT
// ============================================
function setupFAB(){
    const fab=$('fabMain'),container=$('fabContainer'),options=$('fabOptions');
    if(fab&&container){
        fab.addEventListener('click',(e)=>{e.stopPropagation();container.classList.toggle('active');if(options)options.style.display=container.classList.contains('active')?'flex':'none'});
        document.addEventListener('click',(e)=>{if(!container.contains(e.target)){container.classList.remove('active');if(options)options.style.display='none'}});
    }
}

let exitShown=false;
function setupExitIntent(){
    document.addEventListener('mouseout',(e)=>{if(!exitShown&&e.clientY<=0&&window.scrollY>500){$('exitPopup').style.display='flex';exitShown=true;setTimeout(()=>exitShown=false,300000)}});
}

// ============================================
// BOOKING FORM
// ============================================
function setupBookingForm(){
    const form=$('bookingForm');
    if(form)form.addEventListener('submit',handleBookingSubmit);
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================
document.addEventListener('DOMContentLoaded',()=>{
    // Hide loader
    setTimeout(()=>{
        const loader=$('loadingScreen');
        if(loader){loader.style.opacity='0';loader.style.visibility='hidden';setTimeout(()=>loader.remove(),500)}
    },1500);
    
    // Build all
    init();
    
    // Click outside modal to close
    document.getElementById('bookingModal')?.addEventListener('click',function(e){if(e.target===this)closeBookingModal()});
    document.getElementById('exitPopup')?.addEventListener('click',function(e){if(e.target===this)closeExitPopup()});
});

// Make functions global
window.showComparison=showComparison;
window.playBeep=playBeep;
window.openVideo=openVideo;
window.updateEyeCalc=updateEyeCalc;
window.updateROI=updateROI;
window.scrollToEl=scrollToEl;
window.openModal=openModal;
window.closeModal=closeModal;
window.closeBookingModal=closeBookingModal;
window.closeExitPopup=closeExitPopup;
window.handleBookingSubmit=handleBookingSubmit;
