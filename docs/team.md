---
layout: page
title: Temui Tim
description: Pengembangan Vite dipandu oleh tim internasional.
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamPageSection,
  VPTeamMembers
} from 'vitepress/theme'
import { core, emeriti } from './_data/team'
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Temui Tim</template>
    <template #lead>
      Pengembangan Vite dipandu oleh tim internasional, beberapa di antaranya
      dipilih untuk ditampilkan di bawah ini.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="core" />
  <VPTeamPageSection>
    <template #title>Tim Emeritus</template>
    <template #lead>
      Di sini kami menghormati beberapa anggota tim yang tidak aktif lagi yang telah
      memberikan kontribusi berharga di masa lalu.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="emeriti" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
