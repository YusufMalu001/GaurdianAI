def calculate_safety_score(
    crowd_density: float,
    lighting_score: float,
    emergency_access: float,
    crime_probability: float,
    isolation_score: float
) -> float:
    """
    Heuristic algorithm for calculating route safety score.
    Inputs should be normalized between 0.0 and 1.0.
    Output is a score out of 100.
    """
    
    # Define Weights
    W_CROWD = 20.0
    W_LIGHTING = 20.0
    W_EMERGENCY = 15.0
    W_CRIME = 25.0
    W_ISOLATION = 20.0
    
    # Calculate base score based on positive factors
    positive_score = (
        (crowd_density * W_CROWD) +
        (lighting_score * W_LIGHTING) +
        (emergency_access * W_EMERGENCY)
    )
    
    # Deduct based on negative factors
    negative_score = (
        (crime_probability * W_CRIME) +
        (isolation_score * W_ISOLATION)
    )
    
    # Base is 50 (neutral ground)
    # Max possible is 50 + 55 - 0 = 105 (capped at 100)
    # Min possible is 50 + 0 - 45 = 5 (floored at 0)
    final_score = 50.0 + positive_score - negative_score
    
    return max(0.0, min(100.0, round(final_score, 2)))
