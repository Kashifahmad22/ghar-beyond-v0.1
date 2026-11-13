
(function(){
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const config=window.GB_CONFIG||{};

  const navbar=$('.navbar');
  const menu=$('#mobileMenu');
  const menuBtn=$('#mobileMenuBtn');
  if(menuBtn&&menu){
    menuBtn.addEventListener('click',()=>{const open=menu.classList.toggle('active'); document.body.classList.toggle('menu-open',open); menuBtn.setAttribute('aria-expanded',String(open));});
    $$('.mobile-menu a',menu).forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('active');document.body.classList.remove('menu-open');menuBtn.setAttribute('aria-expanded','false')}));
  }
  window.addEventListener('scroll',()=>navbar&&navbar.classList.toggle('scrolled',window.scrollY>20),{passive:true});

  const chatBtn=$('#chatBtn'), chatBox=$('#chatBox'), closeChat=$('#closeChat');
  if(chatBtn&&chatBox){
    chatBtn.addEventListener('click',()=>{const open=chatBox.classList.toggle('active');chatBox.setAttribute('aria-hidden',String(!open));});
    closeChat&&closeChat.addEventListener('click',()=>{chatBox.classList.remove('active');chatBox.setAttribute('aria-hidden','true')});
    document.addEventListener('click',e=>{if(chatBox.classList.contains('active')&&!chatBox.contains(e.target)&&!chatBtn.contains(e.target)){chatBox.classList.remove('active');chatBox.setAttribute('aria-hidden','true')}});
  }
  const meeting=()=>{const url=config.meetingUrl;if(!url||url.includes('REPLACE_WITH')){alert('Add your real booking link in js/config.js before using video-call booking.');return;}window.open(url,'_blank','noopener,noreferrer')};
  const meetingBtn=$('#meetingBtn'), chatMeeting=$('#chatMeeting');
  meetingBtn&&meetingBtn.addEventListener('click',e=>{e.preventDefault();meeting()}); chatMeeting&&chatMeeting.addEventListener('click',e=>{e.preventDefault();meeting()});

  const homeDest=$('#homeDestinations');
  if(homeDest&&window.GB_DESTINATIONS){
    homeDest.innerHTML=window.GB_DESTINATIONS.slice(0,5).map((d,i)=>`<article class="destination-card ${i===0?'large':''}"><a href="destinations/${d.slug}/"><div class="card-image"><img src="${d.image}" alt="${d.name}" loading="lazy"><span class="destination-tag">${d.category}</span></div><div class="destination-info"><span class="card-kicker">${d.region}</span><h3>${d.name}</h3><p>${d.shortDescription}</p><div class="card-meta"><span>${d.duration}</span><span>${d.price}</span></div><span class="card-link">Explore destination →</span></div></a></article>`).join('');
  }
  const homePackages=$('#homePackages');
  if(homePackages&&window.GB_PACKAGES){
    homePackages.innerHTML=window.GB_PACKAGES.slice(0,3).map(p=>`<article class="package-card"><a href="packages/${p.slug}/"><div class="package-image"><img src="${p.image}" alt="${p.title}" loading="lazy"><span>${p.price}</span></div><div class="package-content"><small>${p.category.toUpperCase()} • ${p.duration}</small><h3>${p.title}</h3><p>${p.description}</p><span class="card-link">View package →</span></div></a></article>`).join('');
  }

  const filterGroups=$$('.filter-row[data-filter-group]');
  filterGroups.forEach(group=>{
    const type=group.dataset.filterGroup;
    const cards=type==='destinations'?$$('.destination-card',document):$$('.package-card',document);
    const buttons=$$('.filter-btn',group);
    buttons.forEach(btn=>btn.addEventListener('click',()=>{
      buttons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');
      const f=btn.dataset.filter.toLowerCase();
      cards.forEach(card=>{
        const text=card.textContent.toLowerCase();
        card.style.display=(f==='all'||text.includes(f))?'':'none';
      });
    }));
  });

  const form=$('#travelForm');
  if(form){
    const qs=new URLSearchParams(location.search); const pre=qs.get('destination'); if(pre&&$('#destination')){const option=$$('#destination option').find(o=>o.value.toLowerCase()===pre.toLowerCase());if(option)$('#destination').value=option.value;}
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const val=id=>($(id)?.value||'').trim();
      const message=`Hello Ghar Beyond!\n\nI would like to plan a trip.\n\nName: ${val('#name')}\nMobile: ${val('#phone')}\nEmail: ${val('#email')||'Not provided'}\nDestination: ${val('#destination')||'Not decided yet'}\nTravel Date: ${val('#date')||'Flexible'}\nTravellers: ${val('#travellers')||'Not specified'}\nTrip Type: ${val('#tripType')||'Not specified'}\nBudget: ${val('#budget')||'Not specified'}\n\nSpecial Requirements:\n${val('#requirements')||'None'}\n\nPlease help me plan my trip.`;
      window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
    });
  }
})();
