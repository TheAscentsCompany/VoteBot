

const SITE_IDS = [1, 9, 7, 10];
const UUID = "UUID TRIMMED ex: eb69cef08d6b49bb9575e751185834b2";
const USERNAME = "Username ex: WarnD";

// Délais spécifiques après un vote validé (en ms)
const SITE_DELAYS = {
    1: 24 * 60 * 60 * 1000 + 5000, // 24h + 5s
    9: 3 * 60 * 60 * 1000 + 5000,  // 3h + 5s
    7: 1.5 * 60 * 60 * 1000 + 5000, // 1h30 + 5s
    10: 1.5 * 60 * 60 * 1000 + 5000 // 1h30 + 5s
};

// Pour stocker la date de succès de chaque site
const lastSuccess = {};


async function voteForSite(siteId) {
    try {
        const response = await fetch("https://skyblock.fr/vote/initie", {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.9",
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Priority": "u=0"
            },
            "referrer": `https://skyblock.fr/vote?username=${USERNAME}`,
            "body": JSON.stringify({ siteId: String(siteId), uuid: UUID }),
            "method": "POST",
            "mode": "cors"
        });

        if (response.ok) {
            console.log(`[${new Date().toLocaleString()}] Vote initié pour le site de vote ID ${siteId} !`);
            const validateResponse = await fetch("https://skyblock.fr/vote/valider", {
                "credentials": "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "Priority": "u=0"
                },
                "referrer": `https://skyblock.fr/vote?username=${USERNAME}`,
                "body": JSON.stringify({ siteId: String(siteId), uuid: UUID }),
                "method": "POST",
                "mode": "cors"
            });
            if (!validateResponse.ok) {
                // 425 Too Early - Le vote n'est pas encore disponible
                const nextVoteAvailable = await validateResponse.text();
                console.log(`[${new Date().toLocaleString()}] NEXT VOTE AVAILABLE (425 Too Early) pour le site ${siteId}:`, nextVoteAvailable);
                return { status: 'too-early', nextVoteAvailable };
            }
            const nextVoteAvailable = await validateResponse.text();
            lastSuccess[siteId] = new Date();
            console.log(`[${new Date().toLocaleString()}] A Voté pour le site de vote ID ${siteId}`);
            return { status: 'success', nextVoteAvailable };
        } else {
            console.error(`[${new Date().toLocaleString()}] Erreur lors de l'initiation du vote pour le site ${siteId} :`, response.status);
            return { status: 'error', nextVoteAvailable: null };
        }
    } catch (e) {
        console.error(`[${new Date().toLocaleString()}] Exception lors du vote pour le site ${siteId}:`, e);
        return { status: 'error', nextVoteAvailable: null };
    }
}



function scheduleVote(siteId, delayMs) {
    setTimeout(() => handleVote(siteId), delayMs);
}

async function handleVote(siteId) {
    const result = await voteForSite(siteId);
    if (result.status === 'success') {
        // Succès : on note la date et on attend le délai spécifique du site
        const delay = SITE_DELAYS[siteId] || (5 * 60 * 1000); // fallback 5min
        console.log(`[${new Date().toLocaleString()}] Prochain vote pour le site ${siteId} dans ${(delay / 1000 / 60).toFixed(1)} minutes (succès)`);
        scheduleVote(siteId, delay);
    } else if (result.status === 'too-early') {
        // Trop tôt : on réessaie dans 5min, sauf si la date de prochain vote est plus lointaine
        let delay = 5 * 60 * 1000; // 5 minutes par défaut
        console.log(`[${new Date().toLocaleString()}] Prochain essai pour le site ${siteId} dans 5 minutes (trop tôt)`);
        scheduleVote(siteId, delay);
    }
}

function startVoting() {
    for (const siteId of SITE_IDS) {
        handleVote(siteId);
    }
}

startVoting();
